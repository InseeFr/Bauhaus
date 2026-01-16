import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

function CorrespondenceControls() {
  const goBack = useGoBack();
  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack("/classifications/correspondences")} />
    </ActionToolbar>
  );
}

export default CorrespondenceControls;
