import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

export function Controls() {
  const { t } = useTranslation();

  const location = useLocation();

  const nexLocation = location.pathname.replace("/compare", "");

  return (
    <ActionToolbar>
      <ReturnButton label={t("item.returnToCurrentVersion")} action={nexLocation} />
    </ActionToolbar>
  );
}
