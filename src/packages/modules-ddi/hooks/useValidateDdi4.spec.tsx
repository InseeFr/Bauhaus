import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useValidateDdi4 } from "./useValidateDdi4";
import { DDIApi } from "../../sdk";
import type { ReactNode } from "react";
import type { RefObject } from "react";
import type { Toast } from "primereact/toast";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

vi.mock("../../sdk", () => ({
  DDIApi: {
    postValidateDdi4: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options ? `${key}|${JSON.stringify(options)}` : key,
  }),
}));

describe("useValidateDdi4", () => {
  let queryClient: QueryClient;
  let show: ReturnType<typeof vi.fn>;
  let toast: RefObject<Toast>;

  const data = {
    $schema: "ddi:4.0",
    PhysicalInstance: [{ Agency: "fr.insee", ID: "pi-1" }],
  } as unknown as PhysicalInstanceResponse;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const renderValidate = () => renderHook(() => useValidateDdi4(data, toast), { wrapper }).result;

  const runValidate = async () => {
    const result = renderValidate();
    await act(async () => {
      await result.current.validate();
    });
    return result;
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
    show = vi.fn();
    toast = { current: { show } } as unknown as RefObject<Toast>;
  });

  it("signale la validation en cours tant que le back n'a pas répondu", async () => {
    let resolveValidation!: (value: unknown) => void;
    (DDIApi.postValidateDdi4 as any).mockReturnValue(
      new Promise((resolve) => {
        resolveValidation = resolve;
      }),
    );

    const result = renderValidate();
    expect(result.current.isValidating).toBe(false);

    let pending!: Promise<void>;
    await act(async () => {
      pending = result.current.validate();
    });
    expect(result.current.isValidating).toBe(true);

    await act(async () => {
      resolveValidation({ valid: true, errors: [] });
      await pending;
    });
    expect(result.current.isValidating).toBe(false);
  });

  it("retombe sur un état stable même quand la validation échoue", async () => {
    (DDIApi.postValidateDdi4 as any).mockRejectedValue({ message: "Boom", status: 500 });

    const result = await runValidate();

    expect(result.current.isValidating).toBe(false);
  });

  it("envoie la PI au endpoint de validation du back", async () => {
    (DDIApi.postValidateDdi4 as any).mockResolvedValue({ valid: true, errors: [] });

    await runValidate();

    expect(DDIApi.postValidateDdi4).toHaveBeenCalledWith(data);
  });

  it("affiche un toast de succès quand le DDI4 est conforme au schéma", async () => {
    (DDIApi.postValidateDdi4 as any).mockResolvedValue({ valid: true, errors: [] });

    await runValidate();

    expect(show).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "success",
        summary: "physicalInstance.view.validateDdi4Success",
      }),
    );
  });

  it("liste les erreurs de validation renvoyées par le back en 400", async () => {
    (DDIApi.postValidateDdi4 as any).mockRejectedValue({
      valid: false,
      errors: ["$.PhysicalInstance: is missing", "$.Variable[0].ID: does not match pattern"],
      status: 400,
    });

    await runValidate();

    expect(show).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "physicalInstance.view.validateDdi4Error",
        sticky: true,
        detail: expect.stringContaining("$.PhysicalInstance: is missing"),
      }),
    );
    expect(show.mock.calls[0][0].detail).toContain("$.Variable[0].ID: does not match pattern");
  });

  it("tronque la liste au-delà de 10 erreurs et indique le nombre restant", async () => {
    const errors = Array.from({ length: 13 }, (_, index) => `erreur-${index}`);
    (DDIApi.postValidateDdi4 as any).mockRejectedValue({ valid: false, errors, status: 400 });

    await runValidate();

    const { detail } = show.mock.calls[0][0];
    expect(detail).toContain("erreur-9");
    expect(detail).not.toContain("erreur-10");
    expect(detail).toContain(
      `physicalInstance.view.validateDdi4MoreErrors|${JSON.stringify({ count: 3 })}`,
    );
  });

  it("affiche un message générique quand l'appel échoue sans corps de validation", async () => {
    (DDIApi.postValidateDdi4 as any).mockRejectedValue({ message: "Boom", status: 500 });

    await runValidate();

    expect(show).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        summary: "physicalInstance.view.validateDdi4Error",
        detail: "Boom",
      }),
    );
  });
});
