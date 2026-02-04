import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Datasets page
  {
    path: "",
    lazy: () => import("../pages/datasets/home/home"),
  },
  {
    path: "search",
    lazy: () => import("../pages/datasets/search/search"),
  },
  {
    path: "create",
    lazy: () => import("../pages/datasets/edit/edit"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/datasets/view/view"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../pages/datasets/edit/edit"),
  },
  // Distributions page
  {
    path: "distributions",
    lazy: () => import("../pages/distributions/home/home"),
  },
  {
    path: "distributions/search",
    lazy: () => import("../pages/distributions/search/search"),
  },
  {
    path: "distributions/create",
    lazy: () => import("../pages/distributions/edit/page"),
  },
  {
    path: "distributions/:id",
    lazy: () => import("../pages/distributions/view/view"),
  },
  {
    path: "distributions/:id/modify",
    lazy: () => import("../pages/distributions/edit/page"),
  },
];
