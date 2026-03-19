import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    lazy: () => import("../pages/concepts/home/page"),
  },
  {
    path: "validation",
    lazy: () => import("../validation/home-container"),
  },
  {
    path: "search",
    lazy: () => import("../advanced-search/home-container"),
  },
  {
    path: "export",
    lazy: () => import("../export/home-container"),
  },
  {
    path: "create",
    lazy: () => import("../pages/concepts/edit/edition-container"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/concepts/view/home-container"),
  },
  {
    path: ":id/compare",
    lazy: () => import("../compare/home-container"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../pages/concepts/edit/edition-container"),
  },
  {
    path: "administration",
    lazy: () => import("../pages/dashboard/home/page"),
  },
  {
    path: "collections",
    lazy: () => import("../pages/collections/home/home-container"),
  },
  {
    path: "collections/create",
    lazy: () => import("../pages/collections/edit/edition-container"),
  },
  {
    path: "collections/:id",
    lazy: () => import("../pages/collections/view/home-container"),
  },
  {
    path: "collections/:id/modify",
    lazy: () => import("../pages/collections/edit/edition-container"),
  },
  {
    path: "collections/validation",
    lazy: () => import("../collections/validation/home-container"),
  },
  {
    path: "collections/export",
    lazy: () => import("../collections/export/home-container"),
  },
];
