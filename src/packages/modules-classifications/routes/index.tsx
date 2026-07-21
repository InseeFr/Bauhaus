import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  // Families pages
  {
    path: "families",
    lazy: () => import("../pages/families/home/page"),
  },
  {
    path: "family/:id",
    lazy: () => import("../pages/families/view/page"),
  },
  // Series pages
  {
    path: "series",
    lazy: () => import("../pages/series/home/page"),
  },
  {
    path: "series/:id",
    lazy: () => import("../pages/series/view/page"),
  },
  // Classifications pages
  {
    path: "",
    lazy: () => import("../pages/classifications/home/page"),
  },
  {
    path: "classification/:id",
    lazy: () => import("../pages/classifications/view/page"),
  },
  {
    path: "classification/:id/modify",
    lazy: () => import("../pages/classifications/edit/page"),
  },
  {
    path: "classification/:id/items",
    lazy: () => import("../pages/classifications/items/page"),
  },
  {
    path: "classification/:id/tree",
    lazy: () => import("../pages/classifications/tree/page"),
  },
  {
    path: "classification/:classificationId/level/:levelId",
    lazy: () => import("../pages/level/view/page"),
  },
  {
    path: "classification/:classificationId/item/:itemId",
    lazy: () => import("../pages/item/view/page"),
  },
  {
    path: "classification/:classificationId/item/:itemId/modify",
    lazy: () => import("../pages/item/edit/page"),
  },
  {
    path: "classification/:classificationId/item/:itemId/compare",
    lazy: () => import("../pages/item/compare/page"),
  },
  // Correspondences pages
  {
    path: "correspondences",
    lazy: () => import("../pages/correspondences/home/page"),
  },
  {
    path: "correspondence/:id",
    lazy: () => import("../pages/correspondences/view/page"),
  },
  {
    path: "correspondence/:correspondenceId/association/:associationId",
    lazy: () => import("../pages/correspondences/association/page"),
  },
];
