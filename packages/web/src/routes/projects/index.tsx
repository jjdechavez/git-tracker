import { For, Match, Switch, createResource } from "solid-js";
import { Navigate, useParams } from "@solidjs/router";
import { useStorage } from "../../providers/storage";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card";
import { EmptyState, LoadingState } from "~/components/state";
import {
  ListGroup,
  ListGroupAnchorItem,
} from "~/components/list-group";
import { Link } from "~/components/link";
import { ROUTES } from "~/App";
import { listPlatforms } from "~/data/platform";
import { useProject } from "~/providers/project";
import { listProductions } from "~/data/production";

export function ProjectsRoute() {
  const storage = useStorage();

  return (
    <Switch>
      <Match when={!storage.value.token}>
        <Navigate href={"/signin"} />
      </Match>
      <Match when={storage.value.token}>
        <Overview />
      </Match>
    </Switch>
  );
}

function Overview() {
  const params = useParams();

  return (
    <section>
      <div class="container p-5">
        <div class="mb-10 flex items-center justify-between">
          <hgroup>
            <h1 class="text-lg font-medium title-font text-white mb-2">
              Overview
            </h1>
            <p class="text-base leading-relaxed">
              View and manage your platforms
            </p>
          </hgroup>

          <div class="flex gap-x-2">
            <Link
              href={ROUTES.CREATE_PRODUCTION_ROUTE.set(params.projectSlug)}
              type="button"
              size="sm"
              class="inline-flex items-center gap-x-2"
              variants="secondary"
            >
              New Production
            </Link>
            <Link
              href={ROUTES.CREATE_PLATFORM_ROUTE.set(params.projectSlug)}
              type="button"
              size="sm"
              class="inline-flex items-center gap-x-2"
              variants="secondary"
            >
              New Platform
            </Link>
            <Link
              href={ROUTES.TICKETS_ROUTE.set(params.projectSlug)}
              type="button"
              size="sm"
              class="inline-flex items-center gap-x-2"
            >
              View tickets
            </Link>
          </div>
        </div>

        <div class="flex flex-col items-start gap-4 md:flex-row">
          <Platforms />
          <Productions />
        </div>
      </div>
    </section>
  );
}

function DataList() {
  return (
    <div class="flex items-center border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
      <div class="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 class="text-white text-lg title-font font-medium mb-2">
          Shooting Stars
        </h2>
        <p class="leading-relaxed text-base">
          Blue bottle crucifix vinyl post-ironic four dollar toast vegan
          taxidermy. Gastropub indxgo juice poutine.
        </p>
        <a class="mt-3 text-indigo-400 inline-flex items-center">
          Learn More
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-2"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

function Platforms() {
  const project = useProject();

  const [platforms] = createResource(
    () => ({ project_id: project.id.toString() }),
    listPlatforms
  );

  return (
    <Card class="flex-1 w-full">
      <CardHeader>
        <CardTitle>Platforms</CardTitle>
      </CardHeader>
      <CardContent class="md:p-0">
        <Switch>
          <Match when={platforms.state === "pending"}>
            <LoadingState
              message="Fetching platforms from the server"
              class="md:p-7"
            />
          </Match>
          <Match when={platforms.state === "ready" && platforms().length === 0}>
            <EmptyState message="No platforms to show" class="md:p-7" />
          </Match>
          <Match when={platforms.state === "ready" && platforms().length > 0}>
            <ListGroup>
              <For each={platforms()}>
                {(platform) => (
                  <ListGroupAnchorItem
                    href={ROUTES.PLATFORM_SLUG_ROUTE.set(
                      project.slug,
                      platform.slug
                    )}
                    class="justify-between"
                  >
                    <span>{platform.name}</span>
                  </ListGroupAnchorItem>
                )}
              </For>
            </ListGroup>
          </Match>
        </Switch>
      </CardContent>
    </Card>
  );
}

function Productions() {
  const project = useProject();

  const [productions] = createResource(
    () => ({ project_id: project.id.toString() }),
    listProductions
  );

  return (
    <Card class="flex-1 w-full">
      <CardHeader>
        <CardTitle>Production Pull Request</CardTitle>
      </CardHeader>
      <CardContent class="md:p-0">
        <Switch>
          <Match when={productions.state === "pending"}>
            <LoadingState
              message="Fetching platforms from the server"
              class="md:p-7"
            />
          </Match>
          <Match
            when={productions.state === "ready" && productions().length === 0}
          >
            <EmptyState
              message="No production pull request to show"
              class="md:p-7"
            />
          </Match>
          <Match
            when={productions.state === "ready" && productions().length > 0}
          >
            <ListGroup>
              <For each={productions()}>
                {(production) => (
                  <ListGroupAnchorItem href={"#"} class="justify-between">
                    <span>{production.pushed_date}-{production.platform_slug}</span>
                  </ListGroupAnchorItem>
                )}
              </For>
            </ListGroup>
          </Match>
        </Switch>
      </CardContent>
    </Card>
  );
}
