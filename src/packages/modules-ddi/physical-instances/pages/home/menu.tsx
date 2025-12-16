import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";
import { HasAccess } from "../../../../auth/components/auth";

interface HomePageMenuProps {
  onCreate: () => void;
}

export const HomePageMenu = ({ onCreate }: Readonly<HomePageMenuProps>) => {
  return (
    <VerticalMenu>
      <HasAccess module="DDI_PHYSICALINSTANCE" privilege="CREATE">
        <MasculineButton action={onCreate} component="button" />
      </HasAccess>
    </VerticalMenu>
  );
};
