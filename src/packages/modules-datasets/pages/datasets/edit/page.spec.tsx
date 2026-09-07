import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { AppContextProvider } from "../../../../application/app-context";

const sourceDataset = {
  id: "jd1000",
  altIdentifier: "ALT-1000",
  validationState: "Validated",
  labelLg1: "Recensement",
  labelLg2: "Census",
  disseminationStatus: "http://status/public",
  wasGeneratedIRIs: ["http://serie/s1"],
  catalogRecord: {
    creator: "INSEE",
    contributor: ["DG75-L001"],
    created: "2024-01-01T10:00:00",
    updated: "2024-06-01T10:00:00",
  },
};

vi.mock("../../../hooks/useDataset", () => ({
  useDataset: () => ({ data: sourceDataset, status: "success" }),
}));

const postDataset = vi.fn((_dataset: unknown) => Promise.resolve("jd2000"));
const putDataset = vi.fn((_dataset: unknown) => Promise.resolve("jd1000"));

vi.mock("@sdk/index", () => ({
  DatasetsApi: {
    postDataset: (dataset: unknown) => postDataset(dataset),
    putDataset: (dataset: unknown) => putDataset(dataset),
  },
}));

vi.mock("./validation", () => ({
  validate: () => ({ errorMessage: [] }),
}));

vi.mock("../../../../auth/components/auth", () => ({
  useAuthorizationGuard: () => true,
}));

vi.mock("@utils/creation/use-default-contributor", () => ({
  useDefaultContributor: () => "DG75-L001",
}));

vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => vi.fn() }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const editingDatasetProbe = ({ editingDataset }: { editingDataset: unknown }) => (
  <div data-testid="editing-dataset">{JSON.stringify(editingDataset)}</div>
);

vi.mock("./components/GlobalInformation", () => ({ GlobalInformation: editingDatasetProbe }));
vi.mock("./components/InternalManagement", () => ({ InternalManagement: () => null }));
vi.mock("./components/Notes", () => ({ Notes: () => null }));
vi.mock("./components/StatisticalInformation", () => ({ StatisticalInformation: () => null }));

const renderPage = async (path: string, route: string) => {
  const { Component } = await import("./page");
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path={route} element={<Component />} />
          </Routes>
        </MemoryRouter>
      </AppContextProvider>
    </QueryClientProvider>,
  );
};

const editedDataset = () => JSON.parse(screen.getByTestId("editing-dataset").textContent!);

describe("Dataset Edit Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when duplicating a dataset", () => {
    it("prefills the form with the descriptive fields of the source dataset", async () => {
      await renderPage("/datasets/jd1000/duplicate", "/datasets/:id/duplicate");

      expect(editedDataset()).toEqual({
        labelLg1: "Recensement",
        labelLg2: "Census",
        disseminationStatus: "http://status/public",
        wasGeneratedIRIs: ["http://serie/s1"],
        catalogRecord: { creator: "INSEE", contributor: ["DG75-L001"] },
      });
    });

    it("creates a new dataset instead of updating the source one", async () => {
      await renderPage("/datasets/jd1000/duplicate", "/datasets/:id/duplicate");

      await userEvent.click(screen.getByText("Save"));

      await waitFor(() => expect(postDataset).toHaveBeenCalled());
      expect(putDataset).not.toHaveBeenCalled();
      expect(postDataset.mock.calls[0][0]).not.toHaveProperty("id");
    });
  });

  describe("when updating a dataset", () => {
    it("updates the source dataset", async () => {
      await renderPage("/datasets/jd1000/modify", "/datasets/:id/modify");

      await userEvent.click(screen.getByText("Save"));

      await waitFor(() => expect(putDataset).toHaveBeenCalled());
      expect(postDataset).not.toHaveBeenCalled();
    });
  });
});
