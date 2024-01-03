import { JSX, ParentProps, Show, mergeProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export const EmptyState = (props: ParentProps & { message: string }) => {
  const merged = mergeProps({ message: "No data to show" }, props);

  return (
    <div class="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
      <svg
        class="w-10 h-10 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="22" x2="2" y1="12" y2="12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        <line x1="6" x2="6.01" y1="16" y2="16" />
        <line x1="10" x2="10.01" y1="16" y2="16" />
      </svg>
      <p class="mt-5 text-sm">{merged.message}</p>
      <Show when={props.children}>{props.children}</Show>
    </div>
  );
};

export const CTAWrapper = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const [mainProps, otherProps] = splitProps(props, ["children", "class"]);

  return (
    <div class={twMerge("mt-5", mainProps.class)} {...otherProps}>
      {mainProps.children}
    </div>
  );
};
