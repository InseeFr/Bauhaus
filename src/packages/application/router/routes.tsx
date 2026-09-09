import { Suspense, useMemo } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";

import { Loading } from "@components/loading";
import { NotFound, UnderMaintenance } from "@components/not-found";

import { RBACLink } from ".";
import { useOidc } from "../../auth/create-oidc";
import { withAuth } from "../../auth/hoc";
import D from "../../i18n";
import { routes as ClassificationsRoutes } from "../../modules-classifications/routes/index";
import { routes as CodelistsRoutes } from "../../modules-codelists/routes/index";
import { routes as ConceptsRoutes } from "../../modules-concepts/routes/index";
import { routes as DatasetsRoutes } from "../../modules-datasets/routes/index";
import { routes as OperationsRoutes } from "../../modules-operations/routes/index";
import { routes as StructuresRoutes } from "../../modules-structures/routes/index";
import { routes as DDIRoutes } from "../../modules-ddi/routes/index";
import App from "../app";
import { useAppContext } from "../app-context";
import type { AppName, Module } from "../app-context";
import "./routes.css";

export const HomePage = () => {
  const {
    properties: { modules },
  } = useAppContext();

  /* Quand un seul module se montre, la page d'accueil n'aurait qu'une tuile à proposer :
     autant y aller directement. Les modules masqués ne comptent pas, même joignables par URL. */
  const shownPages = useMemo(
    () => modules.filter((m) => m.show).map((m) => m.identifier),
    [modules],
  );

  if (shownPages.length === 1) {
    return <Navigate to={"/" + shownPages[0]} replace />;
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
  const { login } = useOidc({
    assertUserLoggedIn: false,
  });
  return (
    <div id="login" className="flex">
      <button
        type="button"
        onClick={() => {
          if (!login) {
            return;
          }
          login({
            doesCurrentHrefRequiresAuth: true,
            redirectUrl: "/",
          });
        }}
        className="btn btn-primary"
      >
        {D.authentication.login}
      </button>
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

export default () => {
  const {
    properties: { modules },
  } = useAppContext();

  const router = createBrowserRouter([
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
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router}></RouterProvider>
    </Suspense>
  );
};
