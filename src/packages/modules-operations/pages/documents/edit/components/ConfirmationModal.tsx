import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { Button } from "@components/buttons/button";
import { Dialog } from "@components/ui/dialog";

import { isDocument } from "../../../../utils/isDocument";

interface ConfirmationModalTypes {
  isOpen: boolean;
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
    <Dialog
      className="operations"
      id="updating-document-modal"
      visible={isOpen}
      onHide={onNo}
      header={t("app.confirmation")}
      style={{ width: "50rem", maxWidth: "95vw" }}
      blockScroll
      footer={<ActionToolbar>{buttons}</ActionToolbar>}
    >
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
    </Dialog>
  );
};
