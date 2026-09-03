import { ActionToolbar } from "@components/action-toolbar";
import { ReturnButton } from "@components/buttons/buttons-with-icons";

import { useGoBack } from "@utils/hooks/useGoBack";

export function LevelControls({ id }: Readonly<{ id: string }>) {
  const goBack = useGoBack();

  return (
    <ActionToolbar>
      <ReturnButton action={() => goBack(`/classifications/classification/${id}`)} />
    </ActionToolbar>
  );
}
