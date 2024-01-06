import { JSX, splitProps } from "solid-js";
import { twJoin } from "tailwind-merge";

interface LabelProps extends JSX.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label(props: LabelProps) {
  const [mainProps, otherProps] = splitProps(props, ["children", "required"]);

  return (
    <label
      {...otherProps}
      class={twJoin(
        "leading-7 text-sm text-gray-400",
        mainProps.required &&
          "after:content-['*'] after:ml-0.5 after:text-red-400"
      )}
    >
      {mainProps.children}
    </label>
  );
}
