import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { usePrivileges } from "@utils/hooks/users";

interface HomePageMenuProps {
  onCreate: () => void;
}

export const HomePageMenu = ({ onCreate }: Readonly<HomePageMenuProps>) => {
  const { privileges } = usePrivileges();

  // À la création il n'y a pas encore de ressource : le gating STAMP, qui
  // s'appuie sur le groupe parent, n'est pas applicable. Le bouton est donc
  // affiché dès que la stratégie du privilège CREATE n'est pas NONE ; le
  // filtrage STAMP a lieu plus loin, dans le dialogue de choix du groupe
  // (alimenté par GET /ddi/group, déjà filtré STAMP côté back).
  const createStrategy = privileges
    ?.find((p) => p.application === "DDI_PHYSICALINSTANCE")
    ?.privileges.find((p) => p.privilege === "CREATE")?.strategy;
  const canCreate = !!createStrategy && createStrategy !== "NONE";

  return (
    <VerticalMenu>
      {canCreate && <MasculineButton action={onCreate} component="button" />}
    </VerticalMenu>
  );
};
