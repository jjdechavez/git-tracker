import { createForm, insert } from "@modular-forms/solid";
import { useSearchParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { CloseButtonBadge, OutlineBadge } from "~/components/badge";
import { Button } from "~/components/button";
import { Card, CardContent } from "~/components/card";
import {
  ModularControl,
  ModularTextInput,
} from "~/components/form/modular/text-field";
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
        <Tickets />
      </div>
    </section>
  );
}

type TicketForm = {
  tickets: {
    name: string;
    description?: string;
    commits: never[];
  }[];
};

const initialValues = {
  tickets: [
    {
      name: "FRS-807",
      description: "[Buyer] Packing list pdf",
      commits: [],
    },
    {
      name: "FRS-812",
      description: "[Buyer] Revamp order summary pdf",
      commits: [],
    },
  ],
};

function Tickets() {
  const [ticketsForm, { Form, FieldArray, Field }] = createForm<TicketForm>({
    initialValues,
  });

  return (
    <Card>
      <CardContent>
        <Form onSubmit={(values) => console.log("submit", values)}>
          <FieldArray name="tickets">
            {(tickets) => (
              <Show
                when={tickets.items.length > 0}
                fallback={
                  <EmptyState message="No tickets to show" class="md:p-7">
                    <Button
                      type="button"
                      class="mt-4"
                      onClick={() =>
                        insert(ticketsForm, tickets.name, {
                          value: {
                            name: "",
                            description: "",
                            commits: [],
                          },
                        })
                      }
                    >
                      New ticket
                    </Button>
                  </EmptyState>
                }
              >
                <For each={tickets.items}>
                  {(_, index) => (
                    <div class="flex">
                      <Field name={`${tickets.name}.${index()}.name`}>
                        {(field, props) => (
                          <ModularControl class="flex-initial w-32">
                            <ModularTextInput
                              {...props}
                              value={field.value}
                              error={field.error}
                              type="text"
                              label="Ticket Name"
                              required
                            />
                          </ModularControl>
                        )}
                      </Field>

                      <Field name={`${tickets.name}.${index()}.description`}>
                        {(field, props) => (
                          <ModularControl class="flex-auto w-64">
                            <ModularTextInput
                              {...props}
                              value={field.value}
                              error={field.error}
                              type="text"
                              label="Description"
                            />
                          </ModularControl>
                        )}
                      </Field>
                    </div>
                  )}
                </For>
              </Show>
            )}
          </FieldArray>
        </Form>
      </CardContent>
    </Card>
  );
}
