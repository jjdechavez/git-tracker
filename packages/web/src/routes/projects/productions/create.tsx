import {
  FormError,
  SubmitHandler,
  createForm,
  required,
} from "@modular-forms/solid";
import { useNavigate } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import { ROUTES } from "~/App";
import { Button } from "~/components/button";
import { ModularSelect } from "~/components/form/modular/select";
import {
  ModularControl,
  ModularTextInput,
} from "~/components/form/modular/text-field";
import { listPlatforms } from "~/data/platform";
import { createProduction } from "~/data/production";
import { useProject } from "~/providers/project";

type ProductionForm = {
  pushedDate: string;
  platformId: string;
};

export function CreateProductionRoute() {
  const navigate = useNavigate();
  const [productionForm, { Form, Field }] = createForm<ProductionForm>();
  const project = useProject();

  const [platforms] = createResource(
    () => ({ project_id: project.id.toString() }),
    listPlatforms
  );

  const handleSubmit: SubmitHandler<ProductionForm> = async (
    values,
    _event
  ) => {
    const result = await createProduction({
      ...values,
      projectId: project.id.toString(),
    });

    if (!result.success) {
      throw new FormError<ProductionForm>(result.error.message);
    }

    navigate(ROUTES.PROJECT_SLUG_ROUTE.set(project.slug), {
      replace: true,
    });
  };

  return (
    <section class="relative">
      <div class="container px-5 py-20 mx-auto">
        <div class="flex flex-col text-center w-full mb-10">
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Create a new production
          </h1>
          <p class="text-base leading-relaxed">
            Start by giving your production a details
          </p>
        </div>

        <Show when={productionForm.response.message}>
          {productionForm.response.message}
        </Show>

        <div class="lg:w-1/2 md:w-2/3 mx-auto">
          <Form onSubmit={handleSubmit} class="grid gap-y-4">
            <Field
              name="pushedDate"
              validate={[required("Please enter push date")]}
            >
              {(field, fieldProps) => (
                <ModularControl fullWidth>
                  <ModularTextInput
                    {...fieldProps}
                    type="date"
                    value={field.value}
                    error={field.error}
                    label="Pushed Date"
                    required
                  />
                </ModularControl>
              )}
            </Field>

            <Field
              name="platformId"
              validate={[required("Please select platform")]}
            >
              {(field, fieldProps) => (
                <ModularControl fullWidth>
                  <ModularSelect
                    {...fieldProps}
                    label="Platform"
                    placeholder="Select a platform"
                    options={(platforms() || []).map((platform) => ({
                      label: platform.name,
                      value: platform.id.toString(),
                    }))}
                    value={field.value}
                    error={field.error}
                    required
                  />
                </ModularControl>
              )}
            </Field>

            <div class="p-2 w-full">
              <Button
                type="submit"
                variants="default"
                size="default"
                class="w-full"
                disabled={productionForm.submitting}
              >
                <Show
                  when={productionForm.submitting}
                  fallback={"Create production"}
                >
                  Creating production
                </Show>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
