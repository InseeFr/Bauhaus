import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { Mock, vi } from "vitest";

import { Theme } from "@model/theme";

import { ThemesApi } from "@sdk/index";

import { useThemes } from "./themes";

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren<unknown>) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
vi.mock("../../sdk", () => ({
  ThemesApi: {
    getThemes: vi.fn(),
  },
}));

describe("useThemes Hook", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return formatted themes when the API call is successful", async () => {
    const mockThemes: Theme[] = [
      { uri: "theme1", label: { value: "Theme 1", lang: "FR" } },
      { uri: "theme2", label: { value: "Theme 2", lang: "FR" } },
    ];

    (ThemesApi.getThemes as Mock).mockResolvedValue(mockThemes);

    const { result } = renderHook(() => useThemes(), { wrapper });

    await waitFor(() => {
      expect(result.current?.data?.[0].value).toBe("theme1");
      expect(result.current?.data?.[1].value).toBe("theme2");
    });
  });

  it("trie les thèmes à la française, les libellés en É parmi les E", async () => {
    // Ordre renvoyé par SPARQL : ORDER BY place « Économie » après « Emploi ».
    const mockThemes: Theme[] = [
      { uri: "agr", label: { value: "Agriculture", lang: "fr" } },
      { uri: "emp", label: { value: "Emploi", lang: "fr" } },
      { uri: "eco", label: { value: "Économie", lang: "fr" } },
    ];

    (ThemesApi.getThemes as Mock).mockResolvedValue(mockThemes);

    const { result } = renderHook(() => useThemes(), {
      wrapper: ({ children }: PropsWithChildren<unknown>) => (
        <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current?.data?.map((option) => option.value)).toEqual(["agr", "eco", "emp"]);
    });
  });
});
