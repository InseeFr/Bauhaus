import { useTranslation } from "react-i18next";

import { MasculineButton } from "@components/new-button";
import { VerticalMenu } from "@components/vertical-menu";

import { usePrivileges } from "@utils/hooks/users";

import { useAuthorizationGuard } from "../../../../auth/components/auth";
import { EvictCachesButton } from "./EvictCachesButton";

interface HomePageMenuProps {
  onCreate: () => void;
  /** Ouvre « Nouveau à partir de… » (#1652). */
  onCreateFrom: () => void;
}

export const HomePageMenu = ({ onCreate, onCreateFrom }: Readonly<HomePageMenuProps>) => {
  const { t } = useTranslation();
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
  const isAdministrator = useAuthorizationGuard({
    module: "DDI_PHYSICALINSTANCE",
    privilege: "ADMINISTRATION",
  });

  return (
    <VerticalMenu>
      {canCreate && (
        <MasculineButton
          action={onCreate}
          component="button"
          title={t("physicalInstance.newFrom.newTooltip")}
        />
      )}
      {/* Même gabarit que « Nouveau » : la classe .new-button vient de MasculineButton, rendu sous la même condition. */}
      {canCreate && (
        <button
          type="button"
          className="new-button new-from-button"
          onClick={onCreateFrom}
          title={t("physicalInstance.newFrom.tooltip")}
        >
          <i className="pi pi-copy" aria-hidden="true" />
          <span>{t("physicalInstance.newFrom.button")}</span>
        </button>
      )}
      {isAdministrator && <EvictCachesButton />}
    </VerticalMenu>
  );
};
