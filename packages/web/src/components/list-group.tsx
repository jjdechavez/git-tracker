import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export const ListGroup = (props: JSX.HTMLAttributes<HTMLUListElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);

  return (
    <ul role="list" class={twMerge("flex flex-col divide-y divide-gray-700", mainProps.class)} {...otherProps}>
      {mainProps.children}
    </ul>
  );
};

export const ListGroupItem = (props: JSX.HTMLAttributes<HTMLLIElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);

  return (
    <li
      class={twMerge(
        "inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium text-white -mt-px first:mt-0 last:mb-0 hover:bg-gray-700/50",
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </li>
  );
};
