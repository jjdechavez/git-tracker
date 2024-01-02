import { JSX, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export const Card = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);

  return (
    <div
      class={twMerge(
        "border shadow-sm rounded-lg bg-gray-900 border-gray-700",
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
};

export const CardHeader = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={twMerge(
        "bg-gray-900 border-gray-700 border-b rounded-t-lg py-3 px-4",
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
};

export const CardTitle = (props: JSX.HTMLAttributes<HTMLHeadingElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);
  return (
    <h2
      class={twMerge("mt-1 text-sm text-gray-500", mainProps.class)}
      {...otherProps}
    >
      {mainProps.children}
    </h2>
  );
};

export const CardContent = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);
  return (
    <div class={twMerge("p-4 md:p-5", mainProps.class)} {...otherProps}>
      {mainProps.children}
    </div>
  );
};

export const CardFooter = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={twMerge(
        "bg-gray-900 border-gray-700 border-b rounded-t-lg py-3 px-4",
        mainProps.class
      )}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
};
