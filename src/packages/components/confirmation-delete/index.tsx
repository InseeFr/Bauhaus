import { useTranslation } from "react-i18next";

import { ActionToolbar } from "../action-toolbar";
import { Button } from "../buttons/button";
import { componentsI18n } from "../i18n";
import { Dialog } from "../ui/dialog";

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
    <Dialog
      className={className}
      visible={true}
      onHide={handleNo}
      header={t("deleteTitle")}
      style={{ width: "50rem", maxWidth: "95vw" }}
      blockScroll
      footer={
        <ActionToolbar>
          <Button action={handleNo}>{t("no")}</Button>
          <Button action={handleYes}>{t("yes")}</Button>
        </ActionToolbar>
      }
    >
      {message ?? t("confirmationConceptDelete")}
    </Dialog>
  );
};
