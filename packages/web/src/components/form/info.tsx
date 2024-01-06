import { JSX, children } from "solid-js";
import { twJoin } from "tailwind-merge";

interface InfoProps extends JSX.LabelHTMLAttributes<HTMLElement> {
  state: "info" | "error";
}

export function Info(props: InfoProps) {
  const content = children(() => props.children);

  return (
    <small
      class={twJoin(
        "leading-7 text-sm block",
        props.state === "info" && "text-gray-400",
        props.state === "error" && "text-red-400",
        props.class
      )}
    >
      {content()}
    </small>
  );
}
