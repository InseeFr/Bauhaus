import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    lazy: () => import("../home"),
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
    lazy: () => import("../edition-creation/creation-container"),
  },
  {
    path: ":id",
    lazy: () => import("../visualization/home-container"),
  },
  {
    path: ":id/compare",
    lazy: () => import("../compare/home-container"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../edition-creation/edition-container"),
  },
  {
    path: "administration",
    lazy: () => import("../administration/home"),
  },
  {
    path: "administration/dashboard",
    lazy: () => import("../administration/dashboard/concepts/home-container"),
  },
  {
    path: "collections",
    lazy: () => import("../collections/home-container"),
  },
  {
    path: "collections/create",
    lazy: () => import("../collections/edition-creation/creation-container"),
  },
  {
    path: "collections/:id",
    lazy: () => import("../collections/visualization/home-container"),
  },
  {
    path: "collections/:id/modify",
    lazy: () => import("../collections/edition-creation/edition-container"),
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
