import { useLocation } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

export const Menu = () => {
  const location = useLocation();
  const goBack = useGoBack();
  const nextLocation = location.pathname.replace("/tree", "");

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack(nextLocation)} />
    </ActionToolbar>
  );
};
