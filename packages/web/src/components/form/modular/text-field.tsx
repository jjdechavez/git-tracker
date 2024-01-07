import { JSX, Show, splitProps } from "solid-js";
import { twJoin } from "tailwind-merge";
import { Label } from "../label";
import { Input } from "../input";
import { Info } from "../info";

type TextFieldProps = {
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "date" | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  info?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  autofocus?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

export function ModularTextInput(props: TextFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur", "autofocus"]
  );

  return (
    <>
      <Show when={props.label}>
        <Label for={props.label} required={rootProps.required}>
          {props.label}
        </Label>
      </Show>
      <Input {...inputProps} type={props.type} required={rootProps.required} />
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
    <div class={twJoin("p-2", mainProps.fullWidth && "w-full")} {...otherProps}>
      {mainProps.children}
    </div>
  );
}
