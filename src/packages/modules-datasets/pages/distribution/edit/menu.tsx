import { ActionToolbar } from "@components/action-toolbar";
import {
  CancelButton,
  SaveButton,
} from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

type MenuProps = {
  onSave: () => void;
  isSaveDisabled?: boolean;
};

export const Menu = ({
  onSave,
  isSaveDisabled = false,
}: Readonly<MenuProps>) => {
  const goBack = useGoBack();

  return (
    <ActionToolbar>
      <CancelButton action={() => goBack("/datasets/distributions")} />
      <SaveButton action={onSave} disabled={isSaveDisabled} />
    </ActionToolbar>
  );
};
