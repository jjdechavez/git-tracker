import {
  FormError,
  SubmitHandler,
  createForm,
  required,
} from "@modular-forms/solid";
import { redirect, useNavigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";
import { ROUTES } from "~/App";
import { Button } from "~/components/button";
import { Info } from "~/components/form/info";
import { Input } from "~/components/form/input";
import { Label } from "~/components/form/label";
import { NewPlatform, createPlatform } from "~/data/platform";

export function CreatePlatformRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [platformForm, { Form, Field }] = createForm<NewPlatform>();

  const handleSubmit: SubmitHandler<NewPlatform> = async (values, _event) => {
    const result = await createPlatform(params.projectSlug, values);

    if (!result.success) {
      throw new FormError<NewPlatform>(result.error.message);
    }

    navigate(ROUTES.HOME_ROUTE, { replace: true });
  };

  return (
    <section class="relative">
      <div class="container px-5 py-20 mx-auto">
        <div class="flex flex-col text-center w-full mb-10">
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Create a new platform
          </h1>
          <p class="text-base leading-relaxed">
            Start by giving your platform a name
          </p>
        </div>

        {platformForm.response.message}

        <div class="lg:w-1/2 md:w-2/3 mx-auto">
          <Form onSubmit={handleSubmit} class="grid gap-y-4">
            <Field
              name="name"
              validate={[required("Please enter platform name.")]}
            >
              {(field, props) => (
                <div class="p-2 w-full">
                  <Label for={props.name} required>
                    Name
                  </Label>
                  <Input {...props} autofocus={true} type="text" required />
                  <Info state="info">
                    Needs to be lowercase, unique, and URL friendly.
                  </Info>
                  <Show when={field.error}>
                    <Info state="error">{field.error}</Info>
                  </Show>
                </div>
              )}
            </Field>
            <Field name="prefixTicket">
              {(field, props) => (
                <div class="p-2 w-full">
                  <Label for={props.name}>Prefix Ticket</Label>
                  <Input {...props} type="text" />
                  <Info state="info">This would be use as ticket prefix.</Info>
                  <Show when={field.error}>
                    <Info state="error">{field.error}</Info>
                  </Show>
                </div>
              )}
            </Field>
            <div class="p-2 w-full">
              <Button
                type="submit"
                variants="default"
                size="default"
                class="w-full"
                disabled={platformForm.submitting}
              >
                {platformForm.submitting
                  ? "Creating platform"
                  : "Create platform"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
