import { JSX, ParentProps } from "solid-js";
import { Portal } from "solid-js/web";

export interface ModalProps {
  children: JSX.Element;
}

/**
 * Composition Modal Component
 * @example
 * <Modal>
 *  <ModalContent>
 *    <ModalHeader>
 *      <ModalTitle>Sample Title</ModalTitle>
 *      <ModalDescription>Description about the modal</ModalDescription>
 *    </ModalHeader>
 *
 *    {children}
 *  </ModalContent>
 *
 *  <ModalActions>
 *    <Button>Cancel</Button>
 *  </ModalActions>
 * </Modal>
 */
export function Modal(props: ModalProps) {
  return (
    <Portal mount={document.querySelector("#modal") as Node}>
      <div
        class="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        {/*
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  */}
        {/* Overlay */}
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        {/* End Overlay */}

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {/*
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  */}
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export function ModalContent(props: ParentProps) {
  return (
    <div class="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      {props.children}
    </div>
  );
}

export function ModalHeader(props: ParentProps) {
  return (
    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
      {props.children}
    </div>
  );
}

export function ModalTitle(props: ParentProps) {
  return (
    <h3
      class="text-base font-semibold leading-6 text-gray-200"
      id="modal-title"
    >
      {props.children}
    </h3>
  );
}

export function ModalDescription(props: ParentProps) {
  return (
    <div class="mt-2">
      <p class="text-sm text-gray-500">{props.children}</p>
    </div>
  );
}

export function ModalActions(props: ParentProps) {
  return (
    <div class="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      {props.children}
    </div>
  );
}
