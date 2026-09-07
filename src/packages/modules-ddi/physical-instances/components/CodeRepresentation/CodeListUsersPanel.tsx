import { useTranslation } from "react-i18next";

import { useCodeListUsers } from "../../../hooks/useCodeListUsers";
import { UsersPanel } from "./UsersPanel";

interface CodeListUsersPanelProps {
  agencyId: string;
  id: string;
  /** Variable currently being edited: excluded from the list so it doesn't list itself. */
  currentVariableId?: string;
}

/**
 * Usages d'une CodeList (variables / PI / StudyUnit qui la réutilisent) : récupération via
 * {@link useCodeListUsers}, rendu délégué au panneau présentational {@link UsersPanel}.
 */
export const CodeListUsersPanel = ({
  agencyId,
  id,
  currentVariableId,
}: Readonly<CodeListUsersPanelProps>) => {
  const { t } = useTranslation();
  const { data: usages = [], isLoading, isError } = useCodeListUsers(agencyId, id);

  if (isLoading || isError) {
    return null;
  }

  return (
    <UsersPanel
      usages={usages}
      currentVariableId={currentVariableId}
      title={t("physicalInstance.view.code.usersPanel.title")}
      help={t("physicalInstance.view.code.usersPanel.help")}
      tooltipTargetId={`cl-users-help-${agencyId}-${id}`}
    />
  );
};
