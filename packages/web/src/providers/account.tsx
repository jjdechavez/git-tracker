import { makePersisted } from "@solid-primitives/storage";
import { ParentProps, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

type Context = ReturnType<typeof init>;
const context = createContext<Context>();

function init() {
  const [store, setStore] = makePersisted(
    createStore({
      token: "",
    })
  );

  return {
    value: store,
    set: setStore,
  };
}

export function StorageProvider(props: ParentProps) {
  const ctx = init();
  return <context.Provider value={ctx}>{props.children}</context.Provider>;
}

export function useStorage() {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error("No storage context");
  }
  return ctx;
}

