import {
  createForm,
  insert,
  remove,
  required,
  focus,
} from "@modular-forms/solid";
import { useParams, useSearchParams } from "@solidjs/router";
import {
  For,
  Match,
  Setter,
  Show,
  Switch,
  createEffect,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import { CloseButtonBadge, OutlineBadge } from "~/components/badge";
import { Button } from "~/components/button";
import { Card, CardContent, CardFooter } from "~/components/card";
import {
  ModularControl,
  ModularEditableTextInput,
  ModularTextInput,
} from "~/components/form/modular/text-field";
import { EmptyState, LoadingState } from "~/components/state";
import { Bin, Check, ChevronDown, XMark } from "~/components/svg";
import { NewTicket, createTicket, listTickets } from "~/data/ticket";

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
        {/* <Tickets /> */}
        <Ticketsv2 />
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
                      <div class="flex items-end">
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

                        <div class="flex-initial w-36">
                          <div class="flex align-middle gap-x-0.5 p-2">
                            <Button
                              type="button"
                              variants="link"
                              size="icon"
                              onClick={() =>
                                remove(ticketsForm, tickets.name, {
                                  at: index(),
                                })
                              }
                              title="Delete ticket"
                            >
                              <Bin />
                            </Button>

                            <Button
                              type="button"
                              variants="link"
                              size="icon"
                              title="Hide commits"
                            >
                              <ChevronDown />
                            </Button>
                          </div>
                        </div>
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
                                          label="Commited at"
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
                                          label="Platform"
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
                                      <ModularControl class="col-span-2 sm:col-span-2">
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

                                  <div class="sm:col-span-1 flex items-end">
                                    <div class="mb-2">
                                      <Button
                                        type="button"
                                        variants="link"
                                        onClick={() =>
                                          remove(ticketsForm, commits.name, {
                                            at: index(),
                                          })
                                        }
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
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
                <CardFooter class="px-2 mt-4">
                  <Button
                    type="button"
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
                    Add ticket
                  </Button>
                </CardFooter>
              </Show>
            )}
          </FieldArray>
        </Form>
      </CardContent>
    </Card>
  );
}

type CreateStatus = "idle" | "starting" | "created";

function Ticketsv2() {
  const params = useParams();
  const [tickets, { refetch }] = createResource(
    () => ({ projectSlug: params.projectSlug }),
    listTickets
  );
  const [createStatus, setCreateStatus] = createSignal<CreateStatus>("idle");

  createEffect(() => {
    if (
      createStatus() === "idle" &&
      tickets.state === "ready" &&
      tickets().length > 0
    ) {
      setCreateStatus(() => "created");
    }
  });

  return (
    <Card>
      <CardContent>
        <Switch>
          <Match
            when={createStatus() === "idle" && tickets.state === "pending"}
          >
            <LoadingState
              message="Fetching tickets from the server"
              class="md:p-7"
            />
          </Match>

          <Match
            when={
              createStatus() === "idle" &&
              tickets.state === "ready" &&
              tickets().length === 0
            }
          >
            <EmptyState message="No tickets to show" class="md:p-7">
              <Button
                type="button"
                class="mt-4"
                onClick={() => setCreateStatus(() => "starting")}
              >
                New ticket
              </Button>
            </EmptyState>
          </Match>

          <Match
            when={
              createStatus() === "starting" &&
              tickets.state === "ready" &&
              tickets().length === 0
            }
          >
            <TicketForm
              action="create"
              refetchTickets={refetch}
              setCreateStatus={setCreateStatus}
            />
          </Match>

          <Match when={tickets.state === "ready" && tickets().length > 0}>
            <For each={tickets()}>
              {(ticket) => (
                <EditableTicket
                  ticketId={ticket.id}
                  name={ticket.name}
                  description={ticket.description}
                  refetchTickets={refetch}
                  setCreateStatus={setCreateStatus}
                />
              )}
            </For>
            <CardFooter class="px-2 mt-4">
              <Button type="button">Add ticket</Button>
            </CardFooter>
          </Match>
        </Switch>
      </CardContent>
    </Card>
  );
}

function EditableTicket(props: {
  ticketId: number;
  name: string;
  description?: string;
  refetchTickets: () => void;
  setCreateStatus: Setter<CreateStatus>;
}) {
  const [edit, setEdit] = createSignal(false);

  return (
    <Show
      when={edit()}
      fallback={
        <button
          type="button"
          onClick={() => {
            setEdit((prevEdit) => !prevEdit);
          }}
          class="w-full hover:bg-gray-700/50"
        >
          <div class="w-auto flex items-end text-start">
            <ModularControl class="flex-initial w-36">
              <ModularEditableTextInput
                label="Ticket Name"
                value={props.name}
              />
            </ModularControl>

            <ModularControl class="flex-auto w-64">
              <ModularEditableTextInput
                label="Description"
                value={props.description}
              />
            </ModularControl>
          </div>
        </button>
      }
    >
      <TicketForm
        action="edit"
        refetchTickets={props.refetchTickets}
        setCreateStatus={props.setCreateStatus}
        setEdit={setEdit}
        ticketId={props.ticketId}
        fields={{
          name: props.name,
          description: props.description,
        }}
      />
    </Show>
  );
}

type TicketFormv2 = Pick<NewTicket, "name" | "description">;
type TicketBaseProps = {
  refetchTickets: () => void;
  setCreateStatus: Setter<CreateStatus>;
};
type TicketCreateForm = TicketBaseProps & {
  action: "create";
};
type TicketEditForm = TicketBaseProps & {
  action: "edit";
  setEdit: Setter<boolean>;
  fields: TicketFormv2;
  ticketId: number;
};
type TicketFormProps = TicketCreateForm | TicketEditForm;

function TicketForm(props: TicketFormProps) {
  const params = useParams();
  const [ticketsForm, { Form, Field }] = createForm<TicketFormv2>({
    initialValues:
      props.action === "edit"
        ? { name: props.fields.name, description: props.fields.description }
        : { name: "", description: undefined },
  });

  onMount(() => {
    focus(ticketsForm, "name");
  });

  return (
    <Form
      onSubmit={async (value) => {
        if (props.action === "create") {
          await createTicket({
            ...value,
            projectSlug: params.projectSlug,
          });
        }
        props.refetchTickets();
        props.setCreateStatus(() => "created");
      }}
    >
      <div class="flex items-end">
        <Field
          name="name"
          validate={[required("Please enter your ticket name")]}
        >
          {(field, fieldProps) => (
            <ModularControl class="flex-initial w-36">
              <ModularTextInput
                {...fieldProps}
                value={field.value}
                error={field.error}
                type="text"
                label="Ticket Name"
                required
                onKeyDown={(event) => {
                  if (event.key === "Escape" && props.action === "edit") {
                    props.setEdit((prev) => !prev);
                  }
                }}
              />
            </ModularControl>
          )}
        </Field>

        <Field name="description">
          {(field, fieldProps) => (
            <ModularControl class="flex-auto w-64">
              <ModularTextInput
                {...fieldProps}
                value={field.value}
                error={field.error}
                type="text"
                label="Description"
                onKeyDown={(event) => {
                  if (event.key === "Escape" && props.action === "edit") {
                    props.setEdit((prev) => !prev);
                  }
                }}
              />
            </ModularControl>
          )}
        </Field>

        <div class="flex-initial w-36">
          <div class="flex align-middle gap-x-0.5 p-2">
            <Button
              type="submit"
              variants="link"
              size="icon"
              title="Save changes"
              disabled={ticketsForm.submitting}
            >
              <Check />
            </Button>

            <Show when={props.action === "edit"}>
              <Button
                type="button"
                variants="link"
                size="icon"
                title="Cancel"
                disabled={ticketsForm.submitting}
                onClick={() =>
                  props.action === "edit"
                    ? props.setEdit(false)
                    : console.log("cancel")
                }
              >
                <XMark />
              </Button>
            </Show>
          </div>
        </div>
      </div>
    </Form>
  );
}
