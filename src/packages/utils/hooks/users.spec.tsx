import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePrivileges } from "./users";

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockPrivileges = [
  {
    application: "APP1",
    privileges: [{ privilege: "READ", strategy: "ALL" }],
  },
];

vi.mock("@sdk/users-api", async () => {
  const actual = await vi.importActual<typeof import("@sdk/users-api")>("@sdk/users-api");
  return {
    ...actual,
    UsersApi: {
      getInfo: () => mockPrivileges,
    },
  };
});

describe("usePrivileges", () => {
  it("returns privileges from UsersApi.getInfo()", async () => {
    const { result } = renderHook(() => usePrivileges(), {
      wrapper,
    });

    await waitFor(() => expect(result.current.privileges).toEqual(mockPrivileges));
  });
});
