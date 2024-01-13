import { createSignal } from "solid-js";

export function Popover() {
  const [state, setState] = createSignal<"idle" | "open">("idle");

  return (
    <div class="relative">
      <button
        type="button"
        class="flex justify-center items-center h-10 w-10 text-sm font-semibold rounded-lg border disabled:opacity-50 disabled:pointer-events-none bg-slate-900 border-gray-700 text-white hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600"
        onClick={() =>
          setState((prevState) => (prevState === "idle" ? "open" : "idle"))
        }
      >
        <svg
          class="flex-shrink-0 w-4 h-4"
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
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <span
        class="transition-opacity inline-block w-32 absolute inset-x-0 -bottom-[74px] z-10 py-3 px-4 border text-sm rounded-lg shadow-md bg-gray-900 border-gray-700 text-gray-400"
        classList={{
          "opacity-100 visible": state() === "open",
          "opacity-0 invisible": state() === "idle",
        }}
        role="tooltip"
      >
        Bottom popover
      </span>
    </div>
  );
}
