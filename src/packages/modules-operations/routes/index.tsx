import { Navigate, RouteObject } from "react-router-dom";

import { OperationsApi } from "@sdk/operations-api";

import { CREATE, UPDATE, VIEW } from "../pages/sims/constants";

export const routes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/operations/series" replace />,
  },
  // Families pages
  {
    path: "families",
    lazy: () => import("../pages/families/home/page"),
    loader: () => OperationsApi.getAllFamilies(),
    shouldRevalidate: ({ currentUrl, nextUrl }) => {
      return currentUrl.pathname !== nextUrl.pathname;
    },
  },
  {
    path: "families/create",
    lazy: () => import("../pages/families/edit/page"),
  },
  {
    path: "family/:id",
    lazy: () => import("../pages/families/view/page"),
  },
  {
    path: "family/:id/modify",
    lazy: () => import("../pages/families/edit/page"),
  },
  // Series pages
  {
    path: "series",
    lazy: () => import("../pages/series/home/page"),
  },
  {
    path: "series/search",
    lazy: () => import("../pages/series/search/page"),
  },
  {
    path: "series/create",
    lazy: () => import("../pages/series/edit/page"),
  },
  {
    path: "series/:id",
    lazy: () => import("../pages/series/view/page"),
  },
  {
    path: "series/:id/modify",
    lazy: () => import("../pages/series/edit/page"),
  },
  // Operations pages
  {
    path: "operations",
    lazy: () => import("../pages/operations/home/page"),
  },
  {
    path: "operation/create",
    lazy: () => import("../pages/operations/edit/page"),
  },
  {
    path: "operation/:id",
    lazy: () => import("../pages/operations/view/page"),
  },
  {
    path: "operation/:id/modify",
    lazy: () => import("../pages/operations/edit/page"),
  },
  // Indicators pages
  {
    path: "indicators",
    lazy: () => import("../pages/indicators/home/page"),
  },
  {
    path: "indicator/create",
    lazy: () => import("../pages/indicators/edit/page"),
  },
  {
    path: "indicator/:id",
    lazy: () => import("../pages/indicators/view/page"),
  },
  {
    path: "indicator/:id/modify",
    lazy: () => import("../pages/indicators/edit/page"),
  },
  // Documents and links pages
  {
    path: "documents",
    lazy: () => import("../pages/documents/home/page"),
  },
  {
    path: "document/create",
    lazy: () => import("../pages/documents/edit/page"),
  },
  {
    path: "link/create",
    lazy: () => import("../pages/documents/edit/page"),
  },
  {
    path: "document/:id",
    lazy: () => import("../pages/documents/view/page"),
  },
  {
    path: "link/:id",
    lazy: () => import("../pages/documents/view/page"),
  },
  {
    path: "document/:id/modify",
    lazy: () => import("../pages/documents/edit/page"),
  },
  {
    path: "link/:id/modify",
    lazy: () => import("../pages/documents/edit/page"),
  },
  // Tree page
  {
    path: "tree",
    lazy: () => import("../pages/tree/home/page"),
  },
  // Sims pages
  {
    path: "msd",
    lazy: () => import("../pages/sims/help/page"),
  },
  {
    path: "help/:idSection",
    lazy: () => import("../pages/sims/help/page"),
  },
  {
    path: "series/:idParent/sims/create",
    loader: ({ params }) => {
      return {
        mode: CREATE,
        disableSectionAnchor: true,
        parentType: "series",
        baseUrl: `/operations/series/${params.idParent}/sims/create`,
      };
    },
    lazy: () => import("../pages/sims/create/page"),
  },
  {
    path: "operation/:idParent/sims/create",
    loader: ({ params }) => {
      return {
        mode: CREATE,
        disableSectionAnchor: true,
        parentType: "operation",
        baseUrl: `/operations/operation/${params.idParent}/sims/create`,
      };
    },
    lazy: () => import("../pages/sims/create/page"),
  },
  {
    path: "indicator/:idParent/sims/create",
    loader: ({ params }) => {
      return {
        mode: CREATE,
        disableSectionAnchor: true,
        parentType: "indicator",
        baseUrl: `/operations/indicator/${params.idParent}/sims/create`,
      };
    },
    lazy: () => import("../pages/sims/create/page"),
  },
  {
    path: "sims/:id",
    loader: ({ params }) => {
      return {
        mode: VIEW,
        baseUrl: `/operations/sims/${params.id}/section/`,
      };
    },
    lazy: () => import("../pages/sims/view/page"),
  },
  {
    path: "sims/:id/section/:idSection",
    loader: ({ params }) => {
      return {
        mode: VIEW,
        baseUrl: `/operations/sims/${params.id}/section/`,
      };
    },
    lazy: () => import("../pages/sims/view/page"),
  },
  {
    path: "sims/:id/modify",
    loader: ({ params }) => {
      return {
        mode: UPDATE,
        disableSectionAnchor: true,
        baseUrl: `/operations/sims/${params.id}/modify`,
      };
    },
    lazy: () => import("../pages/sims/create/page"),
  },
];
