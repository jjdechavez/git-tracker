import { Router, Route, useLocation, Navigate } from "@solidjs/router";
import { Match, ParentProps, Switch } from "solid-js";
import SigninRoute from "./routes/signin";
import { useStorage } from "./providers/storage";
import { ProjectsRoute } from "./routes/projects";
import { CreateProjectRoute } from "./routes/projects/create";
import { AvatarInitialsIcon } from "./components/avatar";

function App() {
  return (
    <main class="min-h-screen text-gray-400 bg-gray-900 body-font">
      <Router>
        <Route path="/signin" component={SigninRoute} />
        <Route
          path="/logout"
          component={() => {
            const storage = useStorage();
            localStorage.removeItem("session");
            storage.set("token", "");

            return <Navigate href="/signin" />;
          }}
        />
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
              localStorage.setItem("session", signinToken);
            }

            return (
              <Switch>
                <Match when={signinToken}>
                  <Navigate href={"/platforms"} />
                </Match>
                <Match when={!signinToken}>
                  <Navigate href={"/signin"} />
                </Match>
              </Switch>
            );
          }}
        />
        <Route path="" component={Layout}>
          <Route path="/projects" component={CreateProjectRoute} />
          <Route path="/:projectSlug" component={ProjectsRoute} />
        </Route>
      </Router>
    </main>
  );
}

function Layout(props: ParentProps) {
  const storage = useStorage();

  return (
    <Switch>
      <Match when={!storage.value.token}>
        <Navigate href="/signin" />
      </Match>
      <Match when={storage.value.token}>
        <div class="container mx-auto max-w-5xl px-6">
          <header>
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
              <a class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                <AvatarInitialsIcon text="sample-project" type="project" />
              </a>
              <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-white">Dropdown platforms</a>
              </nav>

              <a
                href="/logout"
                class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
              >
                Logout
              </a>
            </div>
          </header>

          {props.children}
        </div>
      </Match>
    </Switch>
  );
}

export default App;
