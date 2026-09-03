import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Structures pages
  {
    path: "",
    lazy: () => import("../pages/structures/home/page"),
  },
  {
    path: "search",
    lazy: () => import("../pages/structures/search/page"),
  },
  {
    path: "create",
    lazy: () => import("../pages/structures/create/page"),
  },
  {
    path: ":id",
    lazy: () => import("../pages/structures/view/page"),
  },
  {
    path: ":id/update",
    lazy: () => import("../pages/structures/edit/page"),
  },
  {
    path: ":id/duplicate",
    lazy: () => import("../pages/structures/edit/page"),
  },
  // Components pages
  {
    path: "components",
    lazy: () => import("../pages/components/home/page"),
  },
  {
    path: "components/search",
    lazy: () => import("../pages/components/search/page"),
  },
  {
    path: "components/create",
    lazy: () => import("../pages/components/edit/page"),
  },
  {
    path: "components/:id",
    lazy: () => import("../pages/components/view/page"),
  },
  {
    path: "components/:id/modify",
    lazy: () => import("../pages/components/edit/page"),
  },
];
