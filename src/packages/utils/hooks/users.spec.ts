import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useUserStamps } from "./users";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: false,
    data: [{ stamp: "stamp1" }, { stamp: "stamp2" }],
  }),
}));

describe("useUserStamps", () => {
  it("should call useQuery and return stamps", () => {
    const { result } = renderHook(() => useUserStamps());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual([{ stamp: "stamp1" }, { stamp: "stamp2" }]);
  });
});
