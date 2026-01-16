import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "families",
    lazy: () => import("../families/home-container"),
  },
  {
    path: "family/:id",
    lazy: () => import("../families/visualization/home-container"),
  },
  {
    path: "series",
    lazy: () => import("../series/home-container"),
  },
  {
    path: "series/:id",
    lazy: () => import("../series/visualization/home-container"),
  },
  {
    path: "",
    lazy: () => import("../home-container"),
  },
  {
    path: "classification/:id",
    lazy: () => import("../visualization/home-container"),
  },
  {
    path: "classification/:id/modify",
    lazy: () => import("../edition"),
  },
  {
    path: "classification/:id/items",
    lazy: () => import("../visualization/items/home-container"),
  },
  {
    path: "classification/:id/tree",
    lazy: () => import("../visualization/tree/home-container"),
  },
  {
    path: "classification/:classificationId/level/:levelId",
    lazy: () => import("../level/home-container"),
  },
  {
    path: "classification/:classificationId/item/:itemId",
    lazy: () => import("../item/home-container"),
  },
  {
    path: "classification/:classificationId/item/:itemId/modify",
    lazy: () => import("../item/edition"),
  },
  {
    path: "classification/:classificationId/item/:itemId/compare",
    lazy: () => import("../item/compare/home-container"),
  },
  {
    path: "correspondences",
    lazy: () => import("../correspondences/home-container"),
  },
  {
    path: "correspondence/:id",
    lazy: () => import("../correspondences/visualization/home-container"),
  },
  {
    path: "correspondence/:correspondenceId/association/:associationId",
    lazy: () => import("../correspondences/association/home-container"),
  },
];
