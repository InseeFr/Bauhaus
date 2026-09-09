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

const HomePage = () => {
  const {
    properties: { modules },
  } = useAppContext();

  const pages = useMemo(() => modules.map((m) => m.identifier), [modules]);

  if (!pages) {
    return null;
  }

  if (pages.length === 1) {
    return <Navigate to={"/" + pages[0]} replace />;
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

/* Un module absent de la configuration n'expose aucune de ses pages : ses routes filles
   ne sont pas déclarées, si bien qu'une URL profonde ne matche plus que la route `*` et
   que le chunk du module n'est jamais chargé. Sa racine reste annoncée en maintenance. */
export const buildModuleRoutes = (modules: Module[]): RouteObject[] =>
  Object.entries(MODULE_ROUTES).map(([identifier, children]) => {
    if (!modules.some((m) => m.identifier === identifier)) {
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
