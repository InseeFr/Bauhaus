import { useParams } from "react-router-dom";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";

import { cleanId } from "@utils/string-utils";

interface ControlsTypes {
  creation: boolean;
  save: VoidFunction;
  disabledSave?: boolean;
}

export const Controls = ({ creation, save, disabledSave }: ControlsTypes) => {
  const { id } = useParams<{ id: string }>();

  return (
    <ActionToolbar>
      <CancelButton action={creation ? "/structures" : `/structures/${cleanId(id)}`} />
      <SaveButton action={save} disabled={disabledSave} />
    </ActionToolbar>
  );
};
