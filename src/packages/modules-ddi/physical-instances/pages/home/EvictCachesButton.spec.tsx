import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { ddiI18n } from "../../../i18n";
import { EvictCachesButton } from "./EvictCachesButton";

vi.mock("../../../../sdk", () => ({
  DDIApi: {
    evictCaches: vi.fn(),
  },
}));

const t = (key: string) => ddiI18n.t(key);

const renderButton = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={ddiI18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );
  return render(<EvictCachesButton />, { wrapper });
};

const deferred = () => {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

describe("EvictCachesButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche un loader et désactive le bouton tant que le cache est en cours de vidage", async () => {
    const pending = deferred();
    vi.mocked(DDIApi.evictCaches).mockReturnValue(pending.promise);
    renderButton();

    await userEvent.click(screen.getByRole("button", { name: t("physicalInstance.cache.evict") }));

    const button = screen.getByRole("button", { name: t("physicalInstance.cache.evicting") });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");

    pending.resolve();

    await waitFor(() =>
      expect(screen.getByRole("button", { name: t("physicalInstance.cache.evict") })).toBeEnabled(),
    );
  });

  it("confirme le vidage du cache", async () => {
    vi.mocked(DDIApi.evictCaches).mockResolvedValue(undefined);
    renderButton();

    await userEvent.click(screen.getByRole("button", { name: t("physicalInstance.cache.evict") }));

    expect(await screen.findByText(t("physicalInstance.cache.successMessage"))).toBeInTheDocument();
  });

  it("affiche l'erreur renvoyée par le back", async () => {
    vi.mocked(DDIApi.evictCaches).mockRejectedValue({ message: "Colectica indisponible" });
    renderButton();

    await userEvent.click(screen.getByRole("button", { name: t("physicalInstance.cache.evict") }));

    expect(await screen.findByText("Colectica indisponible")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: t("physicalInstance.cache.evict") })).toBeEnabled();
  });
});
