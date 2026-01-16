import { useLocation } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

function ClassificationControls() {
  const goBack = useGoBack();
  const location = useLocation();
  const nextLocation = location.pathname.replace("/items", "");

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack(nextLocation)} />
    </ActionToolbar>
  );
}

export default ClassificationControls;
