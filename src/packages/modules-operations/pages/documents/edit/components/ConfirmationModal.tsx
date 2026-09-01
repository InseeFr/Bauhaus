import Modal from "react-modal";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { CloseIconButton } from "@components/buttons/buttons-with-icons";

import { isDocument } from "../../../../utils/isDocument";

interface ConfirmationModalTypes {
  isOpen: true;
  document: any;
  onYes: VoidFunction;
  onNo: VoidFunction;
}

export const ConfirmationModal = ({
  document,
  isOpen,
  onYes,
  onNo,
}: Readonly<ConfirmationModalTypes>) => {
  const { t } = useTranslation();

  const modalButtons = [
    {
      label: t("app.no"),
      action: onNo,
    },
    {
      label: t("app.yes"),
      action: onYes,
    },
  ];

  const buttons = modalButtons.map((b) => (
    <Button key={b.label} type="button" action={b.action}>
      {b.label}
    </Button>
  ));

  return (
    <Modal
      className="Modal__Bootstrap modal-dialog operations"
      id="updating-document-modal"
      isOpen={isOpen}
      onRequestClose={onNo}
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <CloseIconButton onClick={onNo} />
          <h4 className="modal-title">{t("app.confirmation")}</h4>
        </div>
        <div className="modal-body">
          <p>
            {isDocument(document)
              ? t("app.warningDocumentWithSimsPrefix")
              : t("app.warningLinkWithSimsPrefix")}
          </p>
          <ul>
            {document.sims?.map((sims: any) => (
              <li key={sims.id}>{sims.labelLg1}</li>
            ))}
          </ul>
          <p>{t("app.warningDocumentLinksWithSimsSuffix")}</p>
        </div>
        <div className="modal-footer">
          <ActionToolbar>{buttons}</ActionToolbar>
        </div>
      </div>
    </Modal>
  );
};
