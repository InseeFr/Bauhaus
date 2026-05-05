import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

import { useClassificationsItem } from "./classifications";

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn().mockReturnValue({
    isLoading: true,
    data: ["data"],
  }),
}));

describe("useClassificationsItem", () => {
  it("should call useQuery", () => {
    const { result } = renderHook(() => useClassificationsItem("coicop2016"));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual(["data"]);
  });
});
