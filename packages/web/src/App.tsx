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
import { ProjectProvider } from "./providers/project";
import { findProjectBySlug } from "./data/project";
import { twMerge } from "tailwind-merge";
import { buttonSizes, buttonVariants } from "./components/button";
import { AvatarInitialsIcon } from "./components/avatar";

import { HomeRoute } from "./routes/home";
import { SigninRoute } from "./routes/signin";
import { ProjectsRoute } from "./routes/projects";
import { CreatePlatformRoute } from "./routes/projects/platforms/create";
import { CreateProjectRoute } from "./routes/projects/create";
import { ProjectTicketsRoute } from "./routes/projects/tickets";
import { CreateProductionRoute } from "./routes/projects/productions/create";
import { ProductionDetailRoute } from "./routes/projects/productions/detail";

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
  TICKETS_ROUTE: {
    path: "/projects/:projectSlug/tickets",
    set: (projectSlug: string) => `/projects/${projectSlug}/tickets` as const,
  },
  CREATE_PLATFORM_ROUTE: {
    path: "/projects/:projectSlug/platforms/create",
    set: (projectSlug: string) =>
      `/projects/${projectSlug}/platforms/create` as const,
  },
  PLATFORM_SLUG_ROUTE: {
    path: "/projects/:projectSlug/tickets",
    set: (projectSlug: string, platformSlug: string) =>
      `/projects/${projectSlug}/tickets?platform=${platformSlug}` as const,
  },
  CREATE_PRODUCTION_ROUTE: {
    path: "/projects/:projectSlug/productions/create",
    set: (projectSlug: string) =>
      `/projects/${projectSlug}/productions/create` as const,
  },
  PRODUCTION_DETAIL_ROUTE: {
    path: "/projects/:projectSlug/productions/:productionId",
    set: (projectSlug: string, productionId: string) =>
      `/projects/${projectSlug}/productions/${productionId}` as const,
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
        <Route path="/" component={Layout}>
          <Route path={ROUTES.HOME_ROUTE} component={HomeRoute} />
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
          <Route
            path={ROUTES.TICKETS_ROUTE.path}
            component={ProjectTicketsRoute}
          />
          <Route
            path={ROUTES.CREATE_PRODUCTION_ROUTE.path}
            component={CreateProductionRoute}
          />
          <Route
            path={ROUTES.PRODUCTION_DETAIL_ROUTE.path}
            component={ProductionDetailRoute}
          />
          <Route path="*" component={() => <h1>Not found</h1>} />
        </Route>
      </Router>
    </main>
  );
}

function LogoutButton() {
  return (
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
  );
}

function Layout(props: ParentProps) {
  const storage = useStorage();
  const navigate = useNavigate();

  if (!storage.value.token) {
    navigate("/signin", { replace: true });
  }

  const params = useParams();
  const [data] = createResource(() => params.projectSlug, findProjectBySlug);

  return (
    <div class="container mx-auto max-w-5xl px-6">
      <Switch>
        <Match when={data.state === "pending"}>Loading..</Match>
        <Match when={data.state === "errored"}>
          Fetched error: {data.error}
        </Match>
        <Match when={!params.projectSlug}>
          <header>
            <div class="container p-5 flex flex-wrap flex-row items-center justify-between">
              <A
                href="/"
                class="flex title-font font-medium items-center text-white"
              >
                <AvatarInitialsIcon text="git-tracker" type="project" />
              </A>
              <nav class="border-l border-gray-700 flex flex-wrap items-center text-base justify-center mr-auto ml-4 py-1 pl-4 ">
                <a class="hover:text-white">Git Tracker</a>
              </nav>

              <LogoutButton />
            </div>
          </header>

          {props.children}
        </Match>
        <Match when={params.projectSlug && data.state === "ready" && data()}>
          <header>
            <div class="container p-5 flex flex-wrap flex-row items-center justify-between">
              <A
                href={`/projects/${data()!.slug}`}
                class="flex title-font font-medium items-center text-white"
              >
                <AvatarInitialsIcon text={data()!.slug} type="project" />
              </A>
              <nav class="border-l border-gray-700 flex flex-wrap items-center text-base justify-center mr-auto ml-4 py-1 pl-4 ">
                <a class="hover:text-white">{data()!.slug}</a>
              </nav>

              <LogoutButton />
            </div>
          </header>

          <ProjectProvider project={data()!}>{props.children}</ProjectProvider>
        </Match>
      </Switch>
    </div>
  );
}

export default App;
