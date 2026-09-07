import { useTranslation } from "react-i18next";

import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { HasAccess } from "../../../../auth/components/auth";

export const Menu = () => {
  const { t } = useTranslation();

  const routes = [
    ["/operations/document/create", t("documents.document")],
    ["/operations/link/create", t("documents.link")],
  ];

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
