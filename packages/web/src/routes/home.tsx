import { Match, Switch } from "solid-js";
import { useStorage } from "../providers/account";
import { Navigate } from "@solidjs/router";

export default function HomeRoute() {
  const storage = useStorage();

  return (
    <Switch>
      <Match when={!storage.value.token}>
        <Navigate href={"/signin"} />
      </Match>
      <Match when={storage.value.token}>
        you're logged in
      </Match>
    </Switch>
  );
}
