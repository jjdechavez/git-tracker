import { mergeProps, splitProps } from "solid-js";
import { A, AnchorProps } from "@solidjs/router";
import { twJoin } from "tailwind-merge";
import { ButtonProps, buttonSizes, buttonVariants } from "./button";

interface LinkProps extends AnchorProps {
  variants?: ButtonProps["variants"];
  size?: ButtonProps["size"];
}

export function Link(props: LinkProps) {
  const [mainProps, otherProps] = splitProps(props, [
    "children",
    "class",
    "variants",
    "size",
  ]);
  const merged = mergeProps(
    { variants: "default" as const, size: "default" as const },
    mainProps
  );

  return (
    <A
      class={twJoin(
        "rounded",
        buttonVariants[merged.variants],
        buttonSizes[merged.size],
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </A>
  );
}
