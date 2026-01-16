import { Navigate, RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "",
    element: <Navigate to="/ddi/physical-instances" replace />,
  },
  {
    path: "physical-instances",
    lazy: () => import("../physical-instances/pages/home/home"),
  },
  {
    path: "physical-instances/:agencyId/:id",
    lazy: () => import("../physical-instances/pages/view/view"),
  },
];
