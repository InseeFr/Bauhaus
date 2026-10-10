import { describe, it, expect, vi, beforeEach } from "vitest";

import { envelope } from "../physical-instances/types/ddi4Items.testing";
import { renderQueryHook, renderQueryHookUntil } from "./queryClient.testing";
import { usePhysicalInstancesData } from "./usePhysicalInstance";

// Mock fetch globally
global.fetch = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      language: "fr-FR",
    },
  }),
}));

const mockApiResponse = envelope({
  Variable: [
    {
      ID: "1",
      VersionDate: { DateTime: "2024-06-03T14:29:23.4049817Z" },
      VariableName: [{ "@language": "fr-FR", "@value": "ACTOCCUPE" }],
      Label: [{ "@language": "fr-FR", "@value": "Actif occupé" }],
      VariableRepresentation: {
        CodeRepresentation: {
          BlankIsMissingValue: false,
          CodeListReference: {
            Agency: "fr.insee",
            ID: "2a22ba00-a977-4a61-a582-99025c6b0582",
            Version: "1",
            TypeOfObject: "CodeList",
          },
        },
      },
    },
    {
      ID: "2",
      VersionDate: { DateTime: "2024-06-03T13:35:37.9342777Z" },
      VariableName: [{ "@language": "fr-FR", "@value": "AG" }],
      Label: [{ "@language": "fr-FR", "@value": "Age" }],
      VariableRepresentation: {
        NumericRepresentation: {
          NumberRange: {
            Low: { IsInclusive: false, value: 0 },
            High: { IsInclusive: false, value: 100 },
          },
          NumericTypeCode: "Integer",
        },
      },
    },
    {
      ID: "3",
      VersionDate: { DateTime: "2024-06-03T13:35:37.9342777Z" },
      VariableName: [{ "@language": "fr-FR", "@value": "UNKNOWN_VAR" }],
      Label: [{ "@language": "fr-FR", "@value": "Unknown Variable" }],
      VariableRepresentation: {},
    },
  ],
});

describe("usePhysicalInstancesData", () => {
  const usePhysicalInstanceUnderTest = () => usePhysicalInstancesData("fr.insee", "test-id");

  const mockFetchOnce = (response: Record<string, unknown>) =>
    (global.fetch as any).mockResolvedValueOnce(response);

  /** Le back répond `body` en 200 ; rend le hook et attend le succès de la requête. */
  const renderWithSuccessfulFetch = async (body: unknown) => {
    mockFetchOnce({ ok: true, json: async () => body });
    const { result } = await renderQueryHookUntil(usePhysicalInstanceUnderTest, "isSuccess");
    return result;
  };

  const expectFetchErrorExposed = async () => {
    const { result } = await renderQueryHookUntil(usePhysicalInstanceUnderTest, "isError");
    expect(result.current.error).toBeDefined();
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and transform data successfully", async () => {
    const result = await renderWithSuccessfulFetch(mockApiResponse);

    expect(result.current.variables).toHaveLength(3);
    expect(result.current.variables[0]).toEqual({
      id: "1",
      name: "ACTOCCUPE",
      label: "Actif occupé",
      type: "code",
      lastModified: expect.stringContaining("2024"),
    });
    expect(result.current.variables[1]).toEqual({
      id: "2",
      name: "AG",
      label: "Age",
      type: "numeric",
      lastModified: expect.stringContaining("2024"),
    });
    expect(result.current.variables[2]).toEqual({
      id: "3",
      name: "UNKNOWN_VAR",
      label: "Unknown Variable",
      type: "text",
      lastModified: expect.stringContaining("2024"),
    });
  });

  for (const { name, body } of [
    { name: "should handle empty variables array", body: { Variable: [] } },
    { name: "should handle missing Variable property", body: {} },
  ]) {
    it(name, async () => {
      const result = await renderWithSuccessfulFetch(body);

      expect(result.current.variables).toEqual([]);
    });
  }

  it("should handle fetch error", async () => {
    mockFetchOnce({ ok: false });

    await expectFetchErrorExposed();
  });

  it("should handle network error", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    await expectFetchErrorExposed();
  });

  it("should return isLoading state initially", () => {
    (global.fetch as any).mockImplementationOnce(() => new Promise(() => {}));

    const { result } = renderQueryHook(usePhysicalInstanceUnderTest);

    expect(result.current.isLoading).toBe(true);
  });

  it("should return dates in ISO format", async () => {
    const result = await renderWithSuccessfulFetch(mockApiResponse);

    // Check that the date is in ISO format (not formatted yet)
    expect(result.current.variables[0].lastModified).toBe("2024-06-03T14:29:23.4049817Z");
  });
});
