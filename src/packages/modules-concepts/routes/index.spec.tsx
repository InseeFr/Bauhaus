import {
  itDeclaresOnlyLazyRoutesWithDistinctPaths,
  itLoadsAComponentForEveryLazyRoute,
} from "../../tests/routes.testing";
import { routes } from "./index";

describe("Concepts routes", () => {
  itLoadsAComponentForEveryLazyRoute(routes);
  itDeclaresOnlyLazyRoutesWithDistinctPaths(routes);
});
