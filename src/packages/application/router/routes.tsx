import { Button } from "primereact/button";
import { Suspense, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { Loading } from "@components/loading";
import { NotFound, UnderMaintenance } from "@components/not-found";

import { useOidc } from "../../auth/create-oidc";
import { withAuth } from "../../auth/hoc";
import { appI18n } from "../../i18n";
import { routes as ClassificationsRoutes } from "../../modules-classifications/routes/index";
import { routes as CodelistsRoutes } from "../../modules-codelists/routes/index";
import { routes as ConceptsRoutes } from "../../modules-concepts/routes/index";
import { routes as DatasetsRoutes } from "../../modules-datasets/routes/index";
import { routes as DDIRoutes } from "../../modules-ddi/routes/index";
import { routes as OperationsRoutes } from "../../modules-operations/routes/index";
import { routes as StructuresRoutes } from "../../modules-structures/routes/index";
import { App } from "../app";
import { useAppContext } from "../app-context";
import type { AppName, Module } from "../app-context";
import { landingModule, SECTION_ROWS } from "../sections";

import { RBACLink } from ".";
import "./routes.css";

export const HomePage = () => {
  const {
    properties: { modules },
  } = useAppContext();

  /* Quand une seule tuile se montre, la page d'accueil n'aurait rien à proposer :
     autant aller directement sur son module. Les modules masqués ne comptent pas,
     même joignables par URL. */
  const targets = useMemo(() => {
    const shownModules = modules.filter((m) => m.show).map((m) => m.identifier);
    return SECTION_ROWS.flat().flatMap((section) => landingModule(section, shownModules) ?? []);
  }, [modules]);

  if (targets.length === 1) {
    return <Navigate to={"/" + targets[0]} replace />;
  }

  return <App />;
};

const MainLayout = withAuth(() => {
  return (
    <RBACLink>
      <Outlet />
    </RBACLink>
  );
});

export const Logout = () => {
  const { t } = useTranslation("translation", { i18n: appI18n });

  const { login } = useOidc({
    assertUserLoggedIn: false,
  });

  return (
    <div id="login" className="flex">
      <Button
        label={t("auth.login")}
        onClick={() => {
          if (!login) {
            return;
          }
          login({
            doesCurrentHrefRequiresAuth: true,
            redirectUrl: "/",
          });
        }}
      />
    </div>
  );
};

const MODULE_ROUTES: Record<AppName, RouteObject[]> = {
  concepts: ConceptsRoutes,
  classifications: ClassificationsRoutes,
  operations: OperationsRoutes,
  structures: StructuresRoutes,
  datasets: DatasetsRoutes,
  codelists: CodelistsRoutes,
  ddi: DDIRoutes,
};

/* Un module fermé — absent de la configuration, ou déclaré sans `directAccess` — n'expose
   aucune de ses pages : ses routes filles ne sont pas déclarées, si bien qu'une URL profonde
   ne matche plus que la route `*` et que le chunk du module n'est jamais chargé. Sa racine
   reste annoncée en maintenance. Un module masqué de la page d'accueil mais gardé accessible
   (`show: false`, `directAccess: true`) conserve, lui, toutes ses routes. */
export const buildModuleRoutes = (modules: Module[]): RouteObject[] =>
  Object.entries(MODULE_ROUTES).map(([identifier, children]) => {
    const module = modules.find((m) => m.identifier === identifier);
    if (!module?.directAccess) {
      return { path: identifier, element: <UnderMaintenance /> };
    }

    return {
      path: identifier,
      lazy: () => import(`../../modules-${identifier}/routes/layout.tsx`),
      children,
    };
  });

/* Le router se construit une seule fois, dès que la configuration des modules est connue
   (réponse de `GeneralApi.getInit()`), et non à chaque rendu : le recréer réinitialiserait
   son état de navigation et relancerait ses chargements. */
export const createAppRouter = (modules: Module[]) =>
  createBrowserRouter(
    [
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "",
        element: <MainLayout />,
        children: [
          { path: "", element: <HomePage /> },
          ...buildModuleRoutes(modules),
          {
            path: "*",
            element: <NotFound />,
          },
        ],
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    },
  );

export type AppRouter = ReturnType<typeof createAppRouter>;

export const Routes = ({ router }: Readonly<{ router: AppRouter }>) => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} future={{ v7_startTransition: true }}></RouterProvider>
  </Suspense>
);
