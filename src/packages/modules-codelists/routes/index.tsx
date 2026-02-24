import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Codelists pages
  {
    path: "",
    lazy: () => import("../pages/codelists/home/page"),
  },
  {
    path: "search",
    lazy: () => import("../pages/codelists/search/page"),
  },
  {
    path: "create",
    lazy: () => import("../pages/codelists/edit/page"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/codelists/view/page"),
  },
  {
    path: ":id/modify",
    lazy: () => import("../pages/codelists/edit/page"),
  },
  // Partial codelists pages
  {
    path: "partial",
    lazy: () => import("../pages/partial-codelists/home/page"),
  },
  {
    path: "partial/search",
    lazy: () => import("../pages/partial-codelists/search/page"),
  },
  {
    path: "partial/create",
    lazy: () => import("../pages/partial-codelists/edit/page"),
  },
  {
    path: "partial/:id",
    lazy: () => import("../pages/partial-codelists/view/page"),
  },
  {
    path: "partial/:id/modify",
    lazy: () => import("../pages/partial-codelists/edit/page"),
  },
];
