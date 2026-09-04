import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { cx } from "@utils/cx";

import { ActionToolbar } from "../action-toolbar";
import { Button } from "../buttons/button";
import { CloseIconButton } from "../buttons/buttons-with-icons";
import { componentsI18n } from "../i18n";

export const ConfirmationDelete = ({
  className,
  handleNo,
  handleYes,
  message,
}: Readonly<{
  className?: string;
  handleNo: any;
  handleYes: any;
  message?: string;
}>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <Modal
      className={cx("Modal__Bootstrap modal-dialog", className)}
      isOpen={true}
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <CloseIconButton onClick={handleNo} />
          <h4 className="modal-title">{t("deleteTitle")}</h4>
        </div>
        <div className="modal-body">{message ?? t("confirmationConceptDelete")}</div>
        <div className="modal-footer text-right">
          <ActionToolbar>
            <Button action={handleNo}>{t("no")}</Button>
            <Button action={handleYes}>{t("yes")}</Button>
          </ActionToolbar>
        </div>
      </div>
    </Modal>
  );
};
