import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router";
import { Mock, vi } from "vitest";

import { WasDerivedFrom } from "@model/Dataset";

import { DatasetsApi } from "@sdk/datasets-api";

import { testsI18n as i18n } from "../../../../../tests/i18n";
import { LineageBlock } from "./LineageBlock";

vi.mock("@sdk/datasets-api", () => ({
  DatasetsApi: { getAll: vi.fn() },
}));

vi.mock("@utils/hooks/second-lang", () => ({ useSecondLang: () => [true] }));

const renderBlock = (wasDerivedFrom?: WasDerivedFrom) =>
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LineageBlock wasDerivedFrom={wasDerivedFrom} />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );

describe("LineageBlock", () => {
  beforeEach(() => {
    (DatasetsApi.getAll as Mock).mockResolvedValue([
      { id: "jd1", label: "Recensement" },
      { id: "jd2", label: "Enquête emploi" },
    ]);
  });

  it("links every dataset the dataset is built from", async () => {
    renderBlock({ datasets: ["jd1", "jd2"] });

    expect(await screen.findByRole("link", { name: "Recensement" })).toHaveAttribute(
      "href",
      "/datasets/jd1",
    );
    expect(screen.getByRole("link", { name: "Enquête emploi" })).toHaveAttribute(
      "href",
      "/datasets/jd2",
    );
  });

  it("displays the bilingual description of the construction", async () => {
    renderBlock({ datasets: ["jd1"], descriptionLg1: "Agrégation", descriptionLg2: "Aggregation" });

    expect(await screen.findByText("Agrégation")).toBeInTheDocument();
    expect(screen.getByText("Aggregation")).toBeInTheDocument();
  });

  it("displays nothing when the dataset is not built from another one", () => {
    const { container } = renderBlock(undefined);

    expect(container).toBeEmptyDOMElement();
  });
});
