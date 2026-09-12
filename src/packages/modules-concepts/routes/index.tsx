import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Concepts pages
  {
    path: "",
    lazy: () => import("../pages/concepts/home/page"),
  },
  {
    path: "search",
    lazy: () => import("../pages/concepts/search/page"),
  },
  {
    path: "create",
    lazy: () => import("../pages/concepts/edit/page"),
  },
  {
    path: "export",
    lazy: () => import("../pages/concepts/export/page"),
  },
  {
    path: "validation",
    lazy: () => import("../pages/concepts/validation/page"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/concepts/view/page"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../pages/concepts/edit/page"),
  },
  {
    path: ":id/compare",
    lazy: () => import("../pages/concepts/compare/page"),
  },
  // Collections pages
  {
    path: "collections",
    lazy: () => import("../pages/collections/home/page"),
  },
  {
    path: "collections/create",
    lazy: () => import("../pages/collections/edit/page"),
  },
  {
    path: "collections/export",
    lazy: () => import("../pages/collections/export/page"),
  },
  {
    path: "collections/validation",
    lazy: () => import("../pages/collections/validation/page"),
  },
  {
    path: "collections/:id",
    lazy: () => import("../pages/collections/view/page"),
  },
  {
    path: "collections/:id/modify",
    lazy: () => import("../pages/collections/edit/page"),
  },
  // Administration
  {
    path: "administration",
    lazy: () => import("../pages/dashboard/home/page"),
  },
];
