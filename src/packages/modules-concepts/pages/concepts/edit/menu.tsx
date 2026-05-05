import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { GlobalClientSideErrorBloc } from "@components/errors-bloc";

import { useGoBack } from "@utils/hooks/useGoBack";

type Props = Readonly<{
  errors?: { errorMessage?: string[] };
  handleSave: () => void;
}>;

export const Menu = ({ errors, handleSave }: Props) => {
  const goBack = useGoBack();

  return (
    <>
      <ActionToolbar>
        <CancelButton action={() => goBack("concepts")} />
        <SaveButton action={handleSave} disabled={errors?.errorMessage?.length > 0} />
      </ActionToolbar>
      <GlobalClientSideErrorBloc clientSideErrors={errors?.errorMessage} />
    </>
  );
};
