import { action, redirect } from "@solidjs/router";
import { Info } from "../../components/form/info";
import { Input } from "../../components/form/input";
import { Label } from "../../components/form/label";
import { createProject } from "../../data/project";

const createProjectAction = action(async (data: FormData) => {
  const name = data.get("name")?.toString();

  if (!name) throw redirect("/projects", { revalidate: "" });

  const project = await createProject(name);

  if (!project.success) {
    throw redirect("/projects", { revalidate: "" });
  }

  return redirect(`/${project.data.slug}`);
});

export function CreateProjectRoute() {
  return (
    <section class="text-gray-400 bg-gray-900 body-font relative">
      <div class="container px-5 py-20 mx-auto">
        <div class="flex flex-col text-center w-full mb-10">
          <h1 class="text-lg font-medium title-font text-white mb-2">
            Create a new project
          </h1>
          <p class="text-base leading-relaxed">
            Start by giving your project a name
          </p>
        </div>

        <div class="lg:w-1/2 md:w-2/3 mx-auto">
          <form action={createProjectAction} method="post" class="grid gap-y-4">
            <div class="p-2 w-full">
              <Label for="name">Name</Label>
              <Input type="text" id="name" name="name" required={true} />
              <Info state="info">
                Needs to be lowercase, unique, and URL friendly.
              </Info>
            </div>
            <div class="p-2 w-full">
              <button class="mx-auto w-full text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
