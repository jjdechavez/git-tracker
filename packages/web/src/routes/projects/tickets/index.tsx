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
    commits: Array<{
      platformId: string;
      hashed: string;
      message?: string;
      commitedAt: string;
    }>;
  }[];
};

const initialValues = {
  tickets: [
    {
      name: "FRS-807",
      description: "[Buyer] Packing list pdf",
      commits: [
        {
          platformId: "1",
          hashed: "42386b",
          message: "Updated delivery address",
          commitedAt: "2024-01-12",
        },
        {
          platformId: "1",
          hashed: "kh9321",
          message: "Implement barcode by order number",
          commitedAt: "2024-01-12",
        },
      ],
    },
    {
      name: "FRS-812",
      description: "[Buyer] Revamp order summary pdf",
      commits: [
        {
          platformId: "2",
          hashed: "321jk3",
          message: "Updated barcode label",
          commitedAt: "2024-01-10",
        },
      ],
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
        <Form
          onSubmit={(values) => console.log("submit", values)}
          onChange={(values) => console.log("change: uses event", values)}
        >
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
                    <>
                      <div class="flex">
                        <Field name={`${tickets.name}.${index()}.name`}>
                          {(field, props) => (
                            <ModularControl class="flex-initial w-36">
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

                      <FieldArray name={`${tickets.name}.${index()}.commits`}>
                        {(commits) => (
                          <>
                            <For each={commits.items}>
                              {(_, index) => (
                                <div class="grid gap-x-2 grid-cols-4 sm:grid-cols-6 divide divide-slate-800">
                                  <Field
                                    name={`${
                                      commits.name
                                    }.${index()}.commitedAt`}
                                  >
                                    {(field, props) => (
                                      <ModularControl class="col-span-2 sm:col-span-1">
                                        <ModularTextInput
                                          {...props}
                                          value={field.value}
                                          error={field.error}
                                          type="text"
                                          label="Commited At"
                                          required
                                        />
                                      </ModularControl>
                                    )}
                                  </Field>

                                  <Field
                                    name={`${
                                      commits.name
                                    }.${index()}.platformId`}
                                  >
                                    {(field, props) => (
                                      <ModularControl class="col-span-2 sm:col-span-1">
                                        <ModularTextInput
                                          {...props}
                                          value={field.value}
                                          error={field.error}
                                          type="text"
                                          label="Commit platform"
                                          required
                                        />
                                      </ModularControl>
                                    )}
                                  </Field>

                                  <Field
                                    name={`${commits.name}.${index()}.hashed`}
                                  >
                                    {(field, props) => (
                                      <ModularControl class="col-span-2 sm:col-span-1">
                                        <ModularTextInput
                                          {...props}
                                          value={field.value}
                                          error={field.error}
                                          type="text"
                                          label="Hashed"
                                          required
                                        />
                                      </ModularControl>
                                    )}
                                  </Field>

                                  <Field
                                    name={`${commits.name}.${index()}.message`}
                                  >
                                    {(field, props) => (
                                      <ModularControl class="col-span-2 sm:col-span-3">
                                        <ModularTextInput
                                          {...props}
                                          value={field.value}
                                          error={field.error}
                                          type="text"
                                          label="Message"
                                        />
                                      </ModularControl>
                                    )}
                                  </Field>
                                </div>
                              )}
                            </For>

                            <div class="p-2 flex flex-wrap gap-4">
                              <Button
                                type="button"
                                onClick={() =>
                                  insert(ticketsForm, commits.name, {
                                    value: {
                                      platformId: "",
                                      hashed: "",
                                      message: "",
                                      commitedAt: "",
                                    },
                                  })
                                }
                              >
                                Add commit
                              </Button>
                            </div>
                          </>
                        )}
                      </FieldArray>
                    </>
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
