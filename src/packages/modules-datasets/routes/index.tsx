import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Datasets page
  {
    path: "",
    lazy: () => import("../pages/datasets/home/page"),
  },
  {
    path: "search",
    lazy: () => import("../pages/datasets/search/page"),
  },
  {
    path: "create",
    lazy: () => import("../pages/datasets/edit/page"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/datasets/view/page"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../pages/datasets/edit/page"),
  },
  // Distributions page
  {
    path: "distributions",
    lazy: () => import("../pages/distributions/home/page"),
  },
  {
    path: "distributions/search",
    lazy: () => import("../pages/distributions/search/page"),
  },
  {
    path: "distributions/create",
    lazy: () => import("../pages/distributions/edit/page"),
  },
  {
    path: "distributions/:id",
    lazy: () => import("../pages/distributions/view/page"),
  },
  {
    path: "distributions/:id/modify",
    lazy: () => import("../pages/distributions/edit/page"),
  },
];
