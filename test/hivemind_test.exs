defmodule HivemindTest do
  use ExUnit.Case
  doctest Hivemind

  test "greets the world" do
    assert Hivemind.hello() == :world
  end
end
