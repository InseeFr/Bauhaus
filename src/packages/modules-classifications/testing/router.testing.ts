import type * as ReactRouterDom from "react-router";

/**
 * Module `react-router` réel dont seul `useParams` est remplacé. S'utilise dans une fabrique
 * de mock :
 * `vi.mock("react-router", async () => (await import("…/router.testing")).withMockedParams(() => params()))`.
 */
export const withMockedParams = async (useParams: () => Record<string, string>) => ({
  ...(await vi.importActual<typeof ReactRouterDom>("react-router")),
  useParams,
});
