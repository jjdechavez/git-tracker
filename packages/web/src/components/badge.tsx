import { JSX, ParentProps, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export function OutlineBadge(props: ParentProps) {
  return (
    <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium border border-gray-600 text-white">
      {props.children}
    </span>
  );
}

export function CloseButtonBadge(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  const [mainProps, otherProps] = splitProps(props, ["class"]);

  return (
    <button
      {...otherProps}
      type="button"
      class={twMerge(
        "flex-shrink-0 h-4 w-4 inline-flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-400",
        mainProps.class
      )}
    >
      <span class="sr-only">Remove badge</span>
      <svg
        class="flex-shrink-0 h-3 w-3"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}
