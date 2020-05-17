defmodule Hivemind do
  use Application

  def start(_type, _args) do
    children = [
      Plug.Cowboy.child_spec(
        scheme: :https,
        plug: Hivemind.Router,
        options: [
          dispatch: dispatch(),
          port: 443,
          keyfile: "/etc/letsencrypt/live/hive-mind.xyz/privkey.pem",
          certfile: "/etc/letsencrypt/live/hive-mind.xyz/fullchain.pem",
        ]
      ),
      Registry.child_spec(
        keys: :duplicate,
        name: Registry.Hivemind
      )
    ]

    opts = [strategy: :one_for_one, name: Hivemind.Application]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
        [
          {"/ws/[...]", Hivemind.SocketHandler, []},
          {:_, Plug.Cowboy.Handler, {Hivemind.Router, []}}
        ]
      }
    ]
  end
end