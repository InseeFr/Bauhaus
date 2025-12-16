import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    lazy: () => import("../components/home/home"),
  },
  {
    path: "create",
    lazy: () => import("../components/codelist-detail/edit-context"),
  },
  {
    path: "search",
    lazy: () => import("../components/search/search"),
  },
  {
    path: ":id",
    lazy: () => import("../components/codelist-detail/view-container"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../components/codelist-detail/edit-context"),
  },
  {
    path: "partial",
    lazy: () => import("../components/home/partial-home"),
  },
  {
    path: "partial/create",
    lazy: () => import("../components/codelist-partial-detail/edit-container"),
  },
  {
    path: "partial/search",
    lazy: () => import("../components/search/partial-search"),
  },
  {
    path: "partial/:id",
    lazy: () => import("../components/codelist-partial-detail/view-container"),
  },
  {
    path: "partial/:id/modify",
    lazy: () => import("../components/codelist-partial-detail/edit-container"),
  },
];
