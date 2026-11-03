import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate, useRouteError } from "react-router";
import type { RouteObject } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { Button } from "@components/ui/button";

import { appI18n } from "../../i18n";
import { isMissingChunk, RootError } from "./root-error";

/**
 * À la place de `<Outlet />` dans le layout d'un module : une page qui suspend garde le menu.
 * Le routeur navigue dans une transition React, qui garderait la page précédente affichée, sans
 * indicateur, pendant que la suivante charge ; la clé par chemin remonte le `Suspense` à chaque
 * page, qui montre alors son indicateur.
 */
export const ModuleOutlet = () => {
  const { pathname } = useLocation();

  return (
    <Suspense key={pathname} fallback={<Loading />}>
      <Outlet />
    </Suspense>
  );
};

/**
 * Échec d'une page de module, affiché sous son menu. « Réessayer » oublie l'échec des lectures
 * (`reset`) puis renavigue vers la même adresse : la frontière d'erreur du routeur se remet à zéro à
 * chaque nouvelle `location`, la page se remonte et relance ses requêtes. Une revalidation n'y
 * suffit pas tant que les pages n'ont pas de `loader`.
 */
const ModuleError = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });
  const error = useRouteError();
  const { reset } = useQueryErrorResetBoundary();
  const location = useLocation();
  const navigate = useNavigate();

  /* Un chunk introuvable après un déploiement se rattrape en rechargeant l'application. */
  if (isMissingChunk(error)) {
    return <RootError />;
  }

  return (
    <div className="container">
      <PageTitle title={t("routeError.title")} />
      <LoadingErrorBloc error={error} />
      <Button
        label={t("routeError.retry")}
        onClick={() => {
          reset();
          void navigate(location, { replace: true });
        }}
      />
    </div>
  );
};

/** Regroupe les pages d'un module sous une route sans chemin qui porte leur encart d'erreur. */
export const withModuleErrorBoundary = (children: RouteObject[]): RouteObject[] => [
  { errorElement: <ModuleError />, children },
];
