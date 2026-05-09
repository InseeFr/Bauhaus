import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { GlobalClientSideErrorBloc } from "@components/errors-bloc";

interface MenuProps {
  handleSave: () => void;
  redirectCancel: () => string;
  errors?: { errorMessage?: string[]; fields?: Record<string, string> };
}

export const Menu = ({ handleSave, redirectCancel, errors }: Readonly<MenuProps>) => {
  return (
    <>
      <ActionToolbar>
        <CancelButton action={redirectCancel()} />
        <SaveButton action={handleSave} disabled={(errors?.errorMessage?.length ?? 0) > 0} />
      </ActionToolbar>
      <GlobalClientSideErrorBloc clientSideErrors={errors?.errorMessage} />
    </>
  );
};
