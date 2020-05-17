# Hive Mind
Realtime thought aggregator

## Need design help!! :) :) :)

## Tech

The server is written in Elixir. Why? Because Elixir uses the Erlang VM, which dominates at handling concurrency at scale.

It uses WebSockets to facilitate communication between clients and the server.

The main html page is at `lib/application.html.eex`

The javascript and css is at `priv/static/js` and `priv/static/css`

Please ask if you're interested and have questions! Best to DM me on Twitter @dannydiekroeger


## Running the Server

Install Elixir: https://elixir-lang.org/install.html

Then from the root folder run
```
sudo iex -S mix
```

Note - this starts an HTTPS server at localhost port 443. If you want to run locally without `sudo` or HTTPS, you'll need to message around with some of the config options. DM me on Twitter with questions!