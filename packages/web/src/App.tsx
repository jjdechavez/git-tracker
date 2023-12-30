import { Router, Route, useLocation, Navigate } from "@solidjs/router";
import { Match, Switch } from "solid-js";
import SigninRoute from "./routes/signin";
import { useStorage } from "./providers/account";
import HomeRoute from "./routes/home";

function App() {
  return (
    <Router>
      <Route path="/" component={HomeRoute} />
      <Route path="/about" component={() => <div>About Page</div>} />
      <Route path="/signin" component={SigninRoute} />
      <Route
        path="/oauth/github"
        component={() => {
          const storage = useStorage();
          const location = useLocation();

          const search = location.search;
          const params = new URLSearchParams(search);
          const signinToken = params.get("token");
          if (signinToken) {
            storage.set("token", signinToken);
          }

          return (
            <Switch>
              <Match when={signinToken}>
                <Navigate href={"/"} />
              </Match>
              <Match when={!signinToken}>
                <Navigate href={"/signin"} />
              </Match>
            </Switch>
          );
        }}
      />
    </Router>
  );
}

export default App;
