import { useSearchParams } from "@solidjs/router";
import { Show } from "solid-js";
import { CloseButtonBadge, OutlineBadge } from "~/components/badge";
import { Card, CardContent } from "~/components/card";
import { EmptyState } from "~/components/state";

export function ProjectTicketsRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <section class="container p-5">
      <div class="mb-10 flex items-center justify-between">
        <hgroup>
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Tickets
          </h1>
          <p class="text-base leading-relaxed">View and manage your tickets</p>
        </hgroup>
      </div>

      <Show when={searchParams.platform}>
        <p>
          Platform:{" "}
          <OutlineBadge>
            {searchParams.platform}
            <CloseButtonBadge
              onClick={() => setSearchParams({ platform: "" })}
            />
          </OutlineBadge>
        </p>
      </Show>

      <div class="mt-8">
        <Card>
          <CardContent class="md:p-0">
            <EmptyState message="No tickets to show" class="md:p-7" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
