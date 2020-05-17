defmodule Parallel do
  def pmap(collection, func) do
    collection
    |> Enum.map(&(Task.async(fn -> func.(&1) end)))
    |> Enum.map(&Task.await/1)
  end
end

defmodule Hivemind.SocketHandler do
    @behaviour :cowboy_websocket
  
    def init(request, _state) do
      state = %{registry_key: request.path}
  
      {:cowboy_websocket, request, state}
    end
  
    def websocket_init(state) do
      Registry.Hivemind
      |> Registry.register(state.registry_key, {})
      
      {:ok, state}
    end
  
    def websocket_handle({:text, json}, state) do
      payload = Jason.decode!(json)
      message = payload["data"]["message"]
      
      Registry.Hivemind
      |> Registry.dispatch(state.registry_key, fn(entries) -> 
        Parallel.pmap entries, &(if &1 != self() do Process.send(&1, message, []) end)
      end)
  
      {:reply, {:text, message}, state}
    end
  
    def websocket_info(info, state) do
      {:reply, {:text, info}, state}
    end
  end