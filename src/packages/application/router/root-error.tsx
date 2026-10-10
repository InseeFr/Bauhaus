import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteError } from "react-router";

import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";

import { appI18n } from "../../i18n";

const RELOADED_AT_KEY = "bauhaus-chunk-reloaded-at";
const RELOAD_GUARD_MS = 10_000;

const isMissingChunk = (error: unknown) =>
  error instanceof Error && error.message.startsWith("Failed to fetch dynamically imported module");

/* Après un déploiement, un onglet resté ouvert réclame des chunks dont le nom a changé :
   recharger la page récupère le nouvel index. Une seule fois, pour ne pas boucler si le
   chunk manque vraiment ; la garde expire pour qu'un déploiement suivant soit lui aussi
   rattrapé dans le même onglet. */
const shouldReloadFor = (error: unknown) => {
  if (!isMissingChunk(error)) {
    return false;
  }
  const reloadedAt = Number(sessionStorage.getItem(RELOADED_AT_KEY));
  return Date.now() - reloadedAt > RELOAD_GUARD_MS;
};

export const RootError = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });
  const error = useRouteError();
  const reloading = shouldReloadFor(error);

  useEffect(() => {
    if (reloading) {
      sessionStorage.setItem(RELOADED_AT_KEY, String(Date.now()));
      window.location.reload();
    }
  }, [reloading]);

  if (reloading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <PageTitle title={t("routeError.title")} />
    </div>
  );
};
