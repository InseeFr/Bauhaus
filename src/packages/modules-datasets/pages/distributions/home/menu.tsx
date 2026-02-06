import { FeminineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../../../auth/components/auth";

export const HomePageMenu = () => {
  return (
    <VerticalMenu>
      <HasAccess module="DATASET_DISTRIBUTION" privilege="CREATE">
        <FeminineButton action="/datasets/distributions/create" />
      </HasAccess>
    </VerticalMenu>
  );
};
