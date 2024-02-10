import { splitProps, type JSX, For, Show } from "solid-js";
import { Label } from "../label";
import { Info } from "../info";

type Option = {
  label: string;
  value: string;
};

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Option[];
  error: string;
}

export function ModularSelect(props: SelectProps) {
  const [rootProps, selectProps] = splitProps(props, [
    "name",
    "placeholder",
    "options",
    "required",
    "disabled",
    "label",
  ]);

  return (
    <>
      <Show when={props.label}>
        <Label for={rootProps.name} required={props.required}>
          {props.label}
        </Label>
      </Show>
      <select
        {...selectProps}
        name={rootProps.name}
        class="py-3 px-4 pe-9 block w-full bg-gray-800 bg-opacity-40 text-sm text-gray-100 border rounded border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 disabled:opacity-50 disabled:pointer-events-none"
        required={rootProps.required}
        aria-invalid={!!selectProps.error}
        aria-errormessage={`${rootProps.name}-error`}
      >
        <option value="" hidden selected disabled>
          <Show when={rootProps.placeholder} fallback="Select an option">
            {rootProps.placeholder}
          </Show>
        </option>
        <For each={props.options}>
          {(option) => (
            <option
              value={option.value}
              selected={props.value === option.value ? true : false}
            >
              {option.label}
            </option>
          )}
        </For>
      </select>
      <Show when={props.error}>
        <Info state="error">{props.error}</Info>
      </Show>
    </>
  );
}
