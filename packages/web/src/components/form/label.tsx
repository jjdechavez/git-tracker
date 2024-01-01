import { JSX, children } from "solid-js";

interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label(props: LabelProps) {
  const content = children(() => props.children);

  return (
    <label for={props.for} class="leading-7 text-sm text-gray-400">
      {content()}
    </label>
  );
}
