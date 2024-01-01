import { JSX, children } from "solid-js";

interface InfoProps extends JSX.LabelHTMLAttributes<HTMLElement> {
  state: "info" | "error";
}

export function Info(props: InfoProps) {
  const content = children(() => props.children);

  return (
    <small
      class="leading-7 text-sm"
      classList={{
        "text-gray-400": props.state === "info",
        "text-red-400": props.state === "error",
      }}
    >
      {content()}
    </small>
  );
}
