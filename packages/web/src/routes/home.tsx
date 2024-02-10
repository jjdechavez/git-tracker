import { Navigate } from "@solidjs/router";
import { For, Match, Switch, createResource } from "solid-js";
import { ROUTES } from "~/App";
import { Card, CardContent } from "~/components/card";
import {
  ListGroup,
  ListGroupAnchorItem,
} from "~/components/list-group";
import { listProjects } from "~/data/project";

export function HomeRoute() {
  const [projects] = createResource(listProjects);

  return (
    <Switch>
      <Match when={projects.state === "pending"}>
        <div>Loading...</div>
      </Match>

      <Match when={projects.state === "errored"}>
        <div>Error: {projects.error}</div>
      </Match>

      <Match when={projects.state === "ready" && projects().length === 0}>
        <Navigate href={ROUTES.CREATE_PROJECT_ROUTE} />
      </Match>

      <Match when={projects.state === "ready" && projects().length > 0}>
        <section class="relative">
          <div class="container px-5 py-20 mx-auto">
            <div class="flex flex-col text-center w-full mb-10">
              <h1 class="text-lg font-medium title-font text-white mb-2">
                Your Projects
              </h1>
              <p class="text-base leading-relaxed">
                Start tracking your commits on your project
              </p>
            </div>

            <div class="lg:w-1/2 md:w-2/3 mx-auto">
              <Card>
                <CardContent>
                  <ListGroup>
                    <For each={projects()}>
                      {(project) => (
                        <ListGroupAnchorItem
                          href={ROUTES.PROJECT_SLUG_ROUTE.set(project.slug)}
                        >
                          <span>{project.name}</span>
                        </ListGroupAnchorItem>
                      )}
                    </For>
                  </ListGroup>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Match>
    </Switch>
  );
}
