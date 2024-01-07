import { ParentProps, createContext, createSignal, useContext } from "solid-js";
// import { createStore } from "solid-js/store";
import { Project } from "~/data/project";

const context = createContext<Project>();

export function ProjectProvider(props: ParentProps & { project: Project }) {
  const [project] = createSignal<Project>(props.project);

  return (
    <context.Provider value={project()}>{props.children}</context.Provider>
  );
}

export function useProject() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("No project context");
  }
  return ctx;
}
