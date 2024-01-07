import { JSX, Show, mergeProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

interface StateProps {
  message: string;
}

interface EmptyStateProps
  extends JSX.HTMLAttributes<HTMLDivElement>,
    StateProps {}

export const EmptyState = (props: EmptyStateProps) => {
  const merged = mergeProps({ message: "No data to show" }, props);

  return (
    <div class={twMerge("text-center p-4 md:p-5", props.class)}>
      <svg
        class="w-10 h-10 text-gray-500 mx-auto"
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

interface LoadingStateProps
  extends JSX.HTMLAttributes<HTMLDivElement>,
    StateProps {}

export const LoadingState = (props: LoadingStateProps) => {
  const merged = mergeProps({ message: "No data to show" }, props);

  return (
    <div class={twMerge("text-center p-4 md:p-5", props.class)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-10 h-10 text-gray-500 mx-auto"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
      <p class="mt-5 text-sm">{merged.message}</p>
      <Show when={props.children}>{props.children}</Show>
    </div>
  );
};
