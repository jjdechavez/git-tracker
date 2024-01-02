import {
  Router,
  Route,
  useLocation,
  Navigate,
  useNavigate,
  useParams,
  A,
} from "@solidjs/router";
import { Match, ParentProps, Switch, createResource } from "solid-js";
import SigninRoute from "./routes/signin";
import { useStorage } from "./providers/storage";
import { ProjectsRoute } from "./routes/projects";
import { CreateProjectRoute } from "./routes/projects/create";
import { AvatarInitialsIcon } from "./components/avatar";
import { findProjectBySlug, listProjects } from "./data/project";

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
                  <Navigate href={"/"} />
                </Match>
                <Match when={!signinToken}>
                  <Navigate href={"/signin"} />
                </Match>
              </Switch>
            );
          }}
        />
        <Route path="" component={Layout}>
          <Route
            path="/"
            component={() => {
              const [result] = createResource(listProjects);

              return (
                <Switch>
                  <Match when={result.loading}>
                    <div>Loading...</div>
                  </Match>
                  <Match when={result.error}>
                    <div>Error: {result.error}</div>
                  </Match>
                  <Match when={result()!.state === "failed_parse"}>
                    <div>Failed Parse: {result()?.message}</div>
                  </Match>
                  <Match
                    when={
                      result()!.state === "ok" &&
                      result()!.data!.data.length === 0
                    }
                  >
                    <Navigate href="/projects" />
                  </Match>
                  <Match
                    when={
                      result()!.state === "ok" &&
                      result()!.data!.data.length > 0
                    }
                  >
                    <Navigate
                      href={`/projects/${
                        result()?.data?.data.find((d) => d)?.slug
                      }`}
                    />
                  </Match>
                </Switch>
              );
            }}
          />
          <Route path="/projects" component={CreateProjectRoute} />
          <Route path="/projects/:projectSlug" component={ProjectsRoute} />
          <Route path="*" component={() => <h1>Not found</h1>} />
        </Route>
      </Router>
    </main>
  );
}

function Layout(props: ParentProps) {
  const storage = useStorage();
  const navigate = useNavigate();

  if (!storage.value.token) {
    navigate("/signin", { replace: true });
  }

  const params = useParams();
  const [data] = createResource(params.projectSlug, findProjectBySlug);

  return (
    <div class="container mx-auto max-w-5xl px-6">
      <header>
        <div class="container mx-auto flex flex-wrap p-5 flex-col justify-between md:flex-row items-center">
          <Switch>
            <Match when={data.loading}>
              <AvatarInitialsIcon text="." type="project" />
            </Match>
            <Match when={data.error}>Fetched error: {data.error}</Match>
            <Match when={!params.projectSlug}>
              <A
                href="/projects"
                class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
              >
                <AvatarInitialsIcon text="git-tracker" type="project" />
              </A>
              <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-white">Git Tracker</a>
              </nav>
            </Match>
            <Match when={params.projectSlug && data()}>
              <A
                href={`/projects/${data()!.slug}`}
                class="flex title-font font-medium items-center text-white mb-4 md:mb-0"
              >
                <AvatarInitialsIcon text={data()!.slug} type="project" />
              </A>
              <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
                <a class="mr-5 hover:text-white">{data()?.slug}</a>
              </nav>
            </Match>
          </Switch>

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
  );
}

export default App;
