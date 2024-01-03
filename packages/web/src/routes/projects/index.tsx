import { For, Match, Show, Switch, createSignal } from "solid-js";
import { Navigate, Route, Router } from "@solidjs/router";
import { useStorage } from "../../providers/storage";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card";
import { CTAWrapper, EmptyState } from "~/components/empty";
import { ListGroup, ListGroupItem } from "~/components/list-group";
import { Button } from "~/components/button";
import { Icon } from "solid-heroicons";
import { plus } from "solid-heroicons/outline";

export function ProjectsRoute() {
  const storage = useStorage();

  return (
    <Switch>
      <Match when={!storage.value.token}>
        <Navigate href={"/signin"} />
      </Match>
      <Match when={storage.value.token}>
        <Content />
      </Match>
    </Switch>
  );
}

function Content() {
  return (
    <Router>
      <Route path="*" component={Overview} />
    </Router>
  );
}

function Overview() {
  const [platforms] = createSignal([]);

  return (
    <section>
      <div class="container p-5">
        <div class="mb-10">
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Overview
          </h1>
          <p class="text-base leading-relaxed">
            View and manage your platforms
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platforms</CardTitle>
          </CardHeader>
          <CardContent class="md:p-0">
            <Show
              when={platforms().length > 0}
              fallback={
                <EmptyState message="No platforms to show">
                  <CTAWrapper>
                    <Button type="button" size="sm" class="inline-flex items-center gap-x-2">
                      <Icon path={plus} class="h-5 w-5" />
                      New platform
                    </Button>
                  </CTAWrapper>
                </EmptyState>
              }
            >
              <ListGroup>
                <For each={platforms()}>
                  {(_) => <ListGroupItem>SFM</ListGroupItem>}
                </For>
              </ListGroup>
            </Show>
          </CardContent>
        </Card>
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
