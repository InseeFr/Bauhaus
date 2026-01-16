import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    lazy: () => import("../datasets/home/home"),
  },
  {
    path: "search",
    lazy: () => import("../datasets/search/search"),
  },
  {
    path: "create",
    lazy: () => import("../datasets/edit/edit"),
  },
  {
    path: ":id",
    lazy: () => import("../datasets/view/view"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../datasets/edit/edit"),
  },
  {
    path: "distributions",
    lazy: () => import("../distributions/home/home"),
  },
  {
    path: "distributions/search",
    lazy: () => import("../distributions/search/search"),
  },
  {
    path: "distributions/create",
    lazy: () => import("../pages/distribution/edit/page"),
  },
  {
    path: "distributions/:id",
    lazy: () => import("../distributions/view/view"),
  },
  {
    path: "distributions/:id/modify",
    lazy: () => import("../pages/distribution/edit/page"),
  },
];
