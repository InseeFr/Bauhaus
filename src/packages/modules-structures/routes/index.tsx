import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    lazy: () => import("../home/home"),
  },
  {
    path: "components",
    lazy: () => import("../components/components-list"),
  },
  {
    path: "search",
    lazy: () => import("../components/structure-search/search"),
  },
  {
    path: "components/search",
    lazy: () => import("../components/component-search/search"),
  },
  {
    path: "components/create",
    lazy: () => import("../components/component-detail/edit-container"),
  },
  {
    path: "components/:id",
    lazy: () => import("../components/component-detail/view-container"),
  },
  {
    path: "components/:id/modify",
    lazy: () => import("../components/component-detail/edit-container"),
  },
  {
    path: "create",
    lazy: () => import("../edition/create"),
  },
  {
    path: ":structureId/update",
    lazy: () => import("../edition/update"),
  },
  {
    path: ":structureId/duplicate",
    lazy: () => import("../edition/update"),
  },
  {
    path: ":structureId",
    lazy: () => import("../visualization"),
  },
];
