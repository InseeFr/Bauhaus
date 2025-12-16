import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { GlobalClientSideErrorBloc } from "@components/errors-bloc";

function Controls({ handleSave, redirectCancel, errors }) {
  return (
    <>
      <ActionToolbar>
        <CancelButton action={redirectCancel()} />
        <SaveButton action={handleSave} disabled={errors?.errorMessage?.length > 0} />
      </ActionToolbar>
      <GlobalClientSideErrorBloc clientSideErrors={errors?.errorMessage} />
    </>
  );
}

export default Controls;
