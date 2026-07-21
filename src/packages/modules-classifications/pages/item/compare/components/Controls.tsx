import { useLocation } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

import D from "../../../../../deprecated-locales";

export function Controls() {
  const location = useLocation();

  const nexLocation = location.pathname.replace("/compare", "");

  return (
    <ActionToolbar>
      <ReturnButton label={D.btnReturnCurrent} action={nexLocation} />
    </ActionToolbar>
  );
}
