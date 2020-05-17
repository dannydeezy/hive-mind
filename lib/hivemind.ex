defmodule Hivemind do
  use Application

  def start(_type, _args) do
    cowboy_options = [          
      keyfile: "/etc/letsencrypt/live/hive-mind.xyz/privkey.pem",
      certfile: "/etc/letsencrypt/live/hive-mind.xyz/fullchain.pem",
      opt_app: :secure_app
    ]
    children = [
      Plug.Cowboy.child_spec(
        :https,
        Hivemind.Router,
        [
          dispatch: dispatch(),
          port: 443,
        ],
        cowboy_options
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