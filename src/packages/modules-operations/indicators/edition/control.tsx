import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

interface ControlTypes {
  onSubmit: VoidFunction;
  disabled?: boolean;
}

function Control({ onSubmit, disabled }: Readonly<ControlTypes>) {
  const goBack = useGoBack();

  return (
    <ActionToolbar>
      <CancelButton action={() => goBack("/operations/indicators")} />
      <SaveButton action={onSubmit} disabled={disabled} />
    </ActionToolbar>
  );
}

export default Control;
