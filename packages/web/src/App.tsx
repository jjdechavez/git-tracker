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
import { useStorage } from "./providers/storage";
import { findProjectBySlug, listProjects } from "./data/project";
import { twMerge } from "tailwind-merge";
import { buttonSizes, buttonVariants } from "./components/button";

import { SigninRoute } from "./routes/signin";
import { ProjectsRoute } from "./routes/projects";
import { CreatePlatformRoute } from "./routes/projects/platforms/create";
import { CreateProjectRoute } from "./routes/projects/create";
import { AvatarInitialsIcon } from "./components/avatar";

export const ROUTES = {
  SIGNIN_ROUTE: "/signin",
  LOGOUT_ROUTE: "/logout",
  OAUTH_GITHUB_ROUTE: "/oauth/github",
  HOME_ROUTE: "/",
  CREATE_PROJECT_ROUTE: "/projects/create",
  PROJECT_SLUG_ROUTE: {
    path: "/projects/:projectSlug",
    set: (slug: string) => `/projects/${slug}` as const,
  },
  CREATE_PLATFORM_ROUTE: {
    path: "/projects/:projectSlug/platforms/create",
    set: (projectSlug: string) =>
      `/projects/${projectSlug}/platforms/create` as const,
  },
} as const;

function App() {
  return (
    <main class="min-h-screen text-gray-400 bg-gray-900 body-font">
      <Router>
        <Route path={ROUTES.SIGNIN_ROUTE} component={SigninRoute} />
        <Route
          path={ROUTES.LOGOUT_ROUTE}
          component={() => {
            const storage = useStorage();
            localStorage.removeItem("session");
            storage.set("token", "");

            return <Navigate href="/signin" />;
          }}
        />
        <Route
          path={ROUTES.OAUTH_GITHUB_ROUTE}
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
            path={ROUTES.HOME_ROUTE}
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
                    <Navigate href={ROUTES.CREATE_PROJECT_ROUTE} />
                  </Match>
                  <Match
                    when={
                      result()!.state === "ok" &&
                      result()!.data!.data.length > 0
                    }
                  >
                    <Navigate
                      href={ROUTES.PROJECT_SLUG_ROUTE.set(
                        result()!.data!.data.find((d) => d)!.slug
                      )}
                    />
                  </Match>
                </Switch>
              );
            }}
          />
          <Route
            path={ROUTES.CREATE_PROJECT_ROUTE}
            component={CreateProjectRoute}
          />
          <Route
            path={ROUTES.PROJECT_SLUG_ROUTE.path}
            component={ProjectsRoute}
          />
          <Route
            path={ROUTES.CREATE_PLATFORM_ROUTE.path}
            component={CreatePlatformRoute}
          />
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
        <div class="container p-5 flex flex-wrap flex-row items-center justify-between">
          <Switch>
            <Match when={data.loading}>
              <AvatarInitialsIcon text="." type="project" />
            </Match>
            <Match when={data.error}>Fetched error: {data.error}</Match>
            <Match when={!params.projectSlug}>
              <A
                href="/projects"
                class="flex title-font font-medium items-center text-white"
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
                class="flex title-font font-medium items-center text-white"
              >
                <AvatarInitialsIcon text={data()!.slug} type="project" />
              </A>
              <nav class="border-l border-gray-700 flex flex-wrap items-center text-base justify-center mr-auto ml-4 py-1 pl-4 ">
                <a class="hover:text-white">{data()?.slug}</a>
              </nav>
            </Match>
          </Switch>

          <a
            href="/logout"
            class={twMerge(
              buttonVariants.secondary,
              buttonSizes.sm,
              "inline-flex items-center"
            )}
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
