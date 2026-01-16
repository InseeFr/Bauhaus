import { ActionToolbar } from "../action-toolbar";
import { ResetButton, ReturnButton } from "../buttons/buttons-with-icons";

export const AdvancedSearchControls = ({
  onClickReturn,
  initializeState,
}: Readonly<{
  onClickReturn: any;
  initializeState: any;
}>) => (
  <ActionToolbar>
    <ReturnButton action={onClickReturn} />
    <ResetButton action={initializeState} />
  </ActionToolbar>
);
