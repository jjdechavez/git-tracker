import { JSX, Show, createMemo, splitProps } from "solid-js";
import { twJoin } from "tailwind-merge";
import { Label } from "../label";
import { Input, type InputProps } from "../input";
import { Info } from "../info";

interface TextFieldProps extends InputProps {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  info?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  autofocus?: boolean | undefined;
}

export function ModularTextInput(props: TextFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
  );

  const getValue = createMemo<string | number | undefined>(
    (prevValue) =>
      props.value === undefined
        ? ""
        : !Number.isNaN(props.value)
        ? props.value
        : prevValue,
    ""
  );

  return (
    <>
      <Show when={props.label}>
        <Label for={props.label} required={rootProps.required}>
          {props.label}
        </Label>
      </Show>
      <Input
        {...inputProps}
        value={getValue()}
        type={props.type}
        required={rootProps.required}
        aria-invalid={!!props.error}
        aria-errormessage={`${props.name}-error`}
      />
      <Show when={props.info}>
        <Info state="info">{props.info}</Info>
      </Show>
      <Show when={props.error}>
        <Info state="error">{props.error}</Info>
      </Show>
    </>
  );
}

interface ModularControlProps extends JSX.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

export function ModularControl(props: ModularControlProps) {
  const [mainProps, otherProps] = splitProps(props, [
    "class",
    "fullWidth",
    "children",
  ]);

  return (
    <div
      class={twJoin("p-2", mainProps.fullWidth && "w-full", mainProps.class)}
      {...otherProps}
    >
      {mainProps.children}
    </div>
  );
}

export function ModularEditableTextInput(props: {
  label?: string;
  value: string | undefined;
}) {
  const getValue = createMemo<string | number | undefined>(
    (prevValue) =>
      props.value === undefined
        ? ""
        : !Number.isNaN(props.value)
        ? props.value
        : prevValue,
    ""
  );

  return (
    <>
      <Show when={props.label}>
        <Label for={props.label}>{props.label}</Label>
      </Show>
      <div>{getValue()}</div>
    </>
  );
}
