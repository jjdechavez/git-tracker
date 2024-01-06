import { JSX, mergeProps, splitProps } from "solid-js";
import { twJoin } from "tailwind-merge";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: "default" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const buttonVariants = {
  default:
    "text-white border-0 bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "text-base bg-gray-800 border-0 focus:outline-none hover:bg-gray-700",
  link: "",
} as const;

export const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
} as const;

export function Button(props: ButtonProps) {
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
    <button
      class={twJoin(
        "rounded",
        buttonVariants[merged.variants],
        buttonSizes[merged.size],
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </button>
  );
}
