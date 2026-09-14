import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "./index";

const createTestRouter = (initialEntries: string[] = ["/"]) => {
  return createMemoryRouter(routes, {
    initialEntries,
  });
};

describe("DDI Routes", () => {
  it("should redirect from root path to physical-instances", () => {
    const router = createTestRouter([""]);
    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe("/ddi/physical-instances");
  });

  it("should have correct route configuration for physical-instances", () => {
    const physicalInstancesRoute = routes.find((route) => route.path === "physical-instances");

    expect(physicalInstancesRoute).toBeDefined();
    expect(physicalInstancesRoute?.lazy).toBeDefined();
    expect(typeof physicalInstancesRoute?.lazy).toBe("function");
  });

  it("should have redirect route configured correctly", () => {
    const redirectRoute = routes.find((route) => route.path === "");

    expect(redirectRoute).toBeDefined();
    expect(redirectRoute?.element).toBeDefined();
  });

  it("should have an advanced search route registered before the item route", () => {
    const searchIndex = routes.findIndex((route) => route.path === "physical-instances/search");
    const itemIndex = routes.findIndex(
      (route) => route.path === "physical-instances/:agencyId/:id",
    );

    expect(searchIndex).toBeGreaterThanOrEqual(0);
    expect(routes[searchIndex]?.lazy).toBeDefined();
    expect(searchIndex).toBeLessThan(itemIndex);
  });

  it("should have correct number of routes", () => {
    expect(routes).toHaveLength(4);
  });
});
