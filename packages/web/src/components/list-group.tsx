import { A, AnchorProps } from "@solidjs/router";
import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export const ListGroup = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);

  return (
    <div
      role="list"
      class={twMerge("flex flex-col divide-y divide-gray-700", mainProps.class)}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
};

const listGroupItemClass =
  "inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium text-white -mt-px first:mt-0 last:mb-0 hover:bg-gray-700/50";

export const ListGroupItem = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);

  return (
    <div
      role="listitem"
      class={twMerge(listGroupItemClass, mainProps.class)}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
};

export const ListGroupAnchorItem = (props: AnchorProps) => {
  const [mainProps, otherProps] = splitProps(props, [
    "class",
    "children",
    "href",
  ]);

  return (
    <A
      role="listitem"
      href={mainProps.href}
      class={twMerge(listGroupItemClass, mainProps.class)}
      {...otherProps}
    >
      {mainProps.children}
    </A>
  );
};
