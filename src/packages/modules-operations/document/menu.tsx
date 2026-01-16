import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../auth/components/auth";
import D from "../../deprecated-locales/build-dictionary";

const routes = [
  ["/operations/document/create", D.document],
  ["/operations/link/create", D.link],
];
export const Menu = () => {
  return (
    <HasAccess module="OPERATION_DOCUMENT" privilege="CREATE">
      <VerticalMenu>
        {routes.map(([url, title]) => (
          <MasculineButton key={title} action={url} suffix={title} />
        ))}
      </VerticalMenu>
    </HasAccess>
  );
};
