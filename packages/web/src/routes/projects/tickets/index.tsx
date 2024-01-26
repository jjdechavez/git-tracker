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
import {
  NewTicket,
  createTicket,
  listTickets,
  updateTicket,
} from "~/data/ticket";
import { NewCommit, createCommit } from "~/data/commit";
import { ModularSelect } from "~/components/form/modular/select";

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

type CreateTicketStatus = "idle" | "creating" | "created";

function Ticketsv2() {
  const params = useParams();
  const [tickets, { refetch, mutate }] = createResource(
    () => ({ projectSlug: params.projectSlug }),
    listTickets
  );
  const [createTicketStatus, setCreateTicketStatus] =
    createSignal<CreateTicketStatus>("idle");

  return (
    <Card>
      <CardContent>
        <Switch>
          <Match when={tickets.state === "pending"}>
            <LoadingState
              message="Fetching tickets from the server"
              class="md:p-7"
            />
          </Match>

          <Match when={tickets.state === "ready" && tickets().length === 0}>
            <EmptyState message="No tickets to show" class="md:p-7">
              <Button
                type="button"
                class="mt-4"
                onClick={() => setCreateTicketStatus(() => "creating")}
              >
                New ticket
              </Button>
            </EmptyState>
          </Match>

          <Match
            when={
              createTicketStatus() === "creating" &&
              tickets.state === "ready" &&
              tickets().length === 0
            }
          >
            <EditableTicket
              action="create"
              afterSubmit={() => {
                refetch();
                setCreateTicketStatus(() => "created");
              }}
            />
          </Match>

          <Match
            when={
              ["ready", "refreshing"].includes(tickets.state) &&
              tickets()!.length > 0
            }
          >
            <For each={tickets()}>
              {(ticket) => (
                <>
                  <EditableTicket
                    action="edit"
                    ticketId={ticket.id}
                    fields={{
                      name: ticket.name,
                      description: ticket.description,
                    }}
                    afterSubmit={(result) => {
                      if (result.action === "edit") {
                        mutate((prev) => {
                          const currentTickets = prev || [];
                          return currentTickets.map((ticket) => {
                            if (ticket.id === result.ticketId) {
                              return {
                                ...ticket,
                                name: result.values.name,
                                description: result.values.description,
                              };
                            }
                            return ticket;
                          });
                        });
                        refetch();
                      }
                    }}
                  />
                  <AddCommit
                    ticketId={ticket.id}
                    afterCreate={() => refetch()}
                  />
                </>
              )}
            </For>
            <CardFooter class="px-2 mt-4">
              <Show
                when={createTicketStatus() === "creating"}
                fallback={
                  <Button
                    type="button"
                    onClick={() => setCreateTicketStatus(() => "creating")}
                  >
                    Add ticket
                  </Button>
                }
              >
                <EditableTicket
                  action="create"
                  afterSubmit={(result) => {
                    if (result.action === "create") {
                      mutate((prev) => {
                        const currentTickets = prev || [];
                        return [
                          ...currentTickets,
                          {
                            id: 0,
                            project_id: 0,
                            name: result.values.name,
                            description: result.values.description,
                          },
                        ];
                      });
                      refetch();
                      setCreateTicketStatus(() => "created");
                    }
                  }}
                  cancelAction={() => {
                    setCreateTicketStatus(() => "idle");
                  }}
                />
              </Show>
            </CardFooter>
          </Match>
        </Switch>
      </CardContent>
    </Card>
  );
}

type TicketFormv2 = Pick<NewTicket, "name" | "description">;
type AfterSubmitCreate = { action: "create"; values: TicketFormv2 };
type AfterSubmitEdit = {
  action: "edit";
  values: TicketFormv2;
  ticketId: number;
};

type EditableTicketBaseProps = {
  afterSubmit: (values: AfterSubmitCreate | AfterSubmitEdit) => void;
  cancelAction?: () => void;
};
type EditableCreateTicket = EditableTicketBaseProps & {
  action: "create";
};
type EditableUpdateTicket = EditableTicketBaseProps & {
  action: "edit";
  fields: TicketFormv2;
  ticketId: number;
};
type EditableTicketProps = EditableCreateTicket | EditableUpdateTicket;

function EditableTicket(props: EditableTicketProps) {
  const params = useParams();
  const [ticketsForm, { Form, Field }] = createForm<TicketFormv2>({
    initialValues:
      props.action === "edit"
        ? { name: props.fields.name, description: props.fields.description }
        : { name: "", description: undefined },
  });
  const [edit, setEdit] = createSignal(false);

  createEffect(() => {
    if (props.action === "create") {
      setEdit(true);
    }
    if (edit()) {
      focus(ticketsForm, "name");
    }
  });

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
                value={props.action === "edit" ? props.fields.name : ""}
              />
            </ModularControl>

            <ModularControl class="flex-auto w-64">
              <ModularEditableTextInput
                label="Description"
                value={props.action === "edit" ? props.fields.description : ""}
              />
            </ModularControl>
          </div>
        </button>
      }
    >
      <Form
        onSubmit={async (values) => {
          if (props.action === "create") {
            await createTicket({
              ...values,
              projectSlug: params.projectSlug,
            });
            props.afterSubmit({
              action: "create",
              values,
            });
          } else if (props.action === "edit") {
            await updateTicket(props.ticketId, values);
            props.afterSubmit({
              action: "edit",
              values,
              ticketId: props.ticketId,
            });
          }
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
                  autofocus={fieldProps.autofocus}
                  value={field.value}
                  error={field.error}
                  type="text"
                  label="Ticket Name"
                  required
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      if (props.action === "edit") {
                        setEdit(false);
                      }
                      props.cancelAction?.();
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
                    if (event.key === "Escape") {
                      if (props.action === "edit") {
                        setEdit(false);
                      }
                      props.cancelAction?.();
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
                  onClick={() => {
                    if (props.action === "edit") {
                      setEdit(false);
                    }

                    props.cancelAction?.();
                  }}
                >
                  <XMark />
                </Button>
              </Show>
            </div>
          </div>
        </div>
      </Form>
    </Show>
  );
}

function AddCommit(props: { ticketId: number; afterCreate: () => void }) {
  const [createCommitStatus, setCreateCommitStatus] =
    createSignal<CreateTicketStatus>("idle");

  return (
    <Switch>
      <Match when={["idle", "created"].includes(createCommitStatus())}>
        <div class="p-2 flex flex-wrap gap-4">
          <Button
            type="button"
            variants="secondary"
            onClick={() => setCreateCommitStatus(() => "creating")}
          >
            Add commit
          </Button>
        </div>
      </Match>

      <Match when={createCommitStatus() === "creating"}>
        <CommitForm
          ticketId={props.ticketId}
          afterSubmit={() => {
            setCreateCommitStatus(() => "created");
            props.afterCreate();
          }}
          cancelAction={() => {
            setCreateCommitStatus(() => "idle");
          }}
        />
      </Match>
    </Switch>
  );
}

function EditableCommit(props: {
  ticketId: number;
  commitedAt: string;
  platformId: string;
  hashed: string;
  message?: string;
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
          <div class="grid gap-x-2 grid-cols-4 sm:grid-cols-6 divide divide-slate-800">
            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularEditableTextInput
                label="Commited At"
                value={props.commitedAt}
              />
            </ModularControl>

            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularEditableTextInput
                label="Platform"
                value={props.platformId}
              />
            </ModularControl>

            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularEditableTextInput label="Hashed" value={props.hashed} />
            </ModularControl>

            <ModularControl class="col-span-2 sm:col-span-2">
              <ModularEditableTextInput label="Message" value={props.message} />
            </ModularControl>
          </div>
        </button>
      }
    >
      ok
    </Show>
  );
}

function CommitForm(props: {
  ticketId: number;
  afterSubmit: (values: NewCommit) => void;
  cancelAction?: () => void;
}) {
  const [commitForm, { Form, Field }] = createForm<NewCommit>({
    initialValues: {
      commitedAt: "",
      platformId: "",
      hashed: "",
      message: undefined,
    },
  });

  onMount(() => {
    focus(commitForm, "commitedAt");
  });

  return (
    <Form
      onSubmit={async (values) => {
        await createCommit(props.ticketId, values);
        props.afterSubmit(values);
      }}
    >
      <div class="grid gap-x-2 grid-cols-4 sm:grid-cols-6 divide divide-slate-800">
        <Field name="commitedAt">
          {(field, fieldProps) => (
            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularTextInput
                {...fieldProps}
                value={field.value}
                error={field.error}
                type="datetime-local"
                label="Commited at"
                required
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    props.cancelAction?.();
                  }
                }}
              />
            </ModularControl>
          )}
        </Field>

        <Field name="platformId">
          {(field, fieldProps) => (
            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularSelect
                {...fieldProps}
                label="Platform"
                placeholder="Select a platform"
                options={[
                  { label: "SFM", value: "1" },
                  { label: "Shoretrade", value: "2" },
                  { label: "White Prince", value: "3" },
                ]}
                value={field.value}
                error={field.error}
                required
              />
            </ModularControl>
          )}
        </Field>

        <Field name="hashed">
          {(field, fieldProps) => (
            <ModularControl class="col-span-2 sm:col-span-1">
              <ModularTextInput
                {...fieldProps}
                value={field.value}
                error={field.error}
                type="text"
                label="Hashed"
                required
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    props.cancelAction?.();
                  }
                }}
                maxlength={6}
              />
            </ModularControl>
          )}
        </Field>

        <Field name="message">
          {(field, fieldProps) => (
            <ModularControl class="col-span-2 sm:col-span-2">
              <ModularTextInput
                {...fieldProps}
                value={field.value}
                error={field.error}
                type="text"
                label="Message"
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    props.cancelAction?.();
                  }
                }}
              />
            </ModularControl>
          )}
        </Field>

        <div class="sm:col-span-1 flex items-end">
          <div class="mb-2">
            <Button
              type="submit"
              variants="link"
              size="icon"
              title="Save changes"
              disabled={commitForm.submitting}
            >
              <Check />
            </Button>

            <Button
              type="button"
              variants="link"
              size="icon"
              title="Cancel"
              disabled={commitForm.submitting}
              onClick={() => {
                props.cancelAction?.();
              }}
            >
              <XMark />
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
