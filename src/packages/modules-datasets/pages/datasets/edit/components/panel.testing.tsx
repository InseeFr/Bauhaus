import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ComponentType, Dispatch, SetStateAction } from "react";
import { I18nextProvider } from "react-i18next";

import { Dataset } from "@model/Dataset";

import { testsI18n as i18n } from "../../../../../tests/i18n";

type ClientSideErrors = {
  errorMessage?: string[];
  fields?: Record<string, string>;
};

type EditPanelProps = {
  editingDataset: Dataset;
  setEditingDataset: (dataset: Dataset) => void;
  clientSideErrors: ClientSideErrors;
  setClientSideErrors: Dispatch<SetStateAction<ClientSideErrors>>;
};

/** Rend un onglet du formulaire d'édition d'un jeu de données avec des setters espions. */
export const renderEditPanel = (
  Panel: ComponentType<EditPanelProps>,
  dataset: Partial<Dataset>,
  clientSideErrors: ClientSideErrors = {},
) => {
  const setEditingDataset = vi.fn();
  const setClientSideErrors = vi.fn();
  const rendered = render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <Panel
          editingDataset={dataset as Dataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
          setClientSideErrors={setClientSideErrors}
        />
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return { ...rendered, setEditingDataset, setClientSideErrors };
};
