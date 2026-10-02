import DOMPurify from "dompurify";
import { ReactNode } from "react";

import { Dialog } from "../ui/dialog";

import "./modal-rmes.css";

export interface ModalButton {
  style: string;
  action: VoidFunction;
  disabled: boolean;
  label: string | ReactNode;
}

export interface ModalRmesTypes {
  id?: string;
  isOpen?: boolean;
  title?: string;
  body?: Node;
  footer?: Node;
  closeCancel: VoidFunction;
  modalButtons: ModalButton[];
}

export const ModalRmes = ({
  id,
  isOpen,
  title,
  body,
  footer,
  closeCancel,
  modalButtons,
}: ModalRmesTypes) => {
  const buttons = modalButtons.map((b: ModalButton, i: number) => (
    <button
      key={`${id}-${i}`}
      type="button"
      className={`btn btn-${b.style}`}
      onClick={b.action}
      disabled={b.disabled}
    >
      {b.label}
    </button>
  ));

  return (
    <Dialog
      id={id}
      visible={!!isOpen}
      onHide={closeCancel}
      header={title}
      style={{ width: "50rem", maxWidth: "95vw" }}
      // Sans cela, le scroll du fond décroche les overlays rendus dans la popup.
      blockScroll
      footer={
        <>
          <div className="modal-rmes-buttons">{buttons}</div>
          {footer && (
            <div
              style={{ textAlign: "left", marginTop: "20px" }}
              className="red"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(footer),
              }}
            />
          )}
        </>
      }
    >
      {body && (
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(body),
          }}
        />
      )}
    </Dialog>
  );
};
