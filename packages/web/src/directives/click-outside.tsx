import { Accessor, onCleanup } from "solid-js";

export default function clickOutside(
  el: HTMLElement,
  accessor: Accessor<() => void>
) {
  console.log(accessor)
  const onClick = (e: MouseEvent) => {
    console.log("clicking");
    return !el.contains(e.target as Node) && accessor()?.();
  };
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      clickOutside: typeof clickOutside;
    }
  }
}
