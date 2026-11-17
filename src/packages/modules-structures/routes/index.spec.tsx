import { describe } from "vitest";

import {
  itDeclaresOnlyLazyRoutesWithDistinctPaths,
  itLoadsAComponentForEveryLazyRoute,
} from "../../tests/routes.testing";
import { routes } from "./index";

describe("Structures routes", () => {
  itLoadsAComponentForEveryLazyRoute(routes);
  itDeclaresOnlyLazyRoutesWithDistinctPaths(routes);
});
