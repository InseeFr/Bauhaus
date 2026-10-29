import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GeographieApi } from "@sdk/geographie";

import { renderWithRouterAndQuery } from "../../tests/render";
import { SimsGeographyPicker } from "./SimsGeographyPicker";

vi.mock("@sdk/geographie", () => ({
  GeographieApi: {
    getAll: vi.fn(),
    postTerritory: vi.fn(),
    putTerritory: vi.fn(),
  },
}));

vi.mock("../../auth/components/auth", () => ({
  HasAccess: ({ children }: { children: unknown }) => children,
}));

vi.mock("react-i18next", async (importOriginal) =>
  (await import("../react-i18next.testing")).mockTranslations(importOriginal, {
    "geography.btnNew": "New",
    "geography.zoneName": "Zone name",
  }),
);

const france = {
  id: "france",
  uri: "http://geo/france",
  labelLg1: "France",
  labelLg2: "France",
  typeTerritory: "Pays",
};

const created = {
  id: "0d4f8c2e-uuid",
  uri: "http://bauhaus/qualite/territoire/0d4f8c2e-uuid",
  labelLg1: "Zone d'emploi de Lille",
  labelLg2: "Lille employment area",
  typeTerritory: "Territoire Statistique",
};

/**
 * Le rapport SIMS (`SimsField`) garde l'URI choisie dans son état, et ne passe que `value`,
 * `onChange` et `secondLang` : on en fait autant.
 */
const Sims = ({ onChange }: { onChange: (value?: string) => void }) => {
  const [value, setValue] = useState("");

  return (
    <SimsGeographyPicker
      value={value}
      onChange={(uri) => {
        setValue(uri ?? "");
        onChange(uri);
      }}
    />
  );
};

const createTerritory = () => {
  fireEvent.click(screen.getByRole("button", { name: "New" }));
  const [nameLg1, nameLg2] = screen.getAllByLabelText(/Zone name/);
  fireEvent.change(nameLg1, { target: { value: created.labelLg1 } });
  fireEvent.change(nameLg2, { target: { value: created.labelLg2 } });
  fireEvent.click(screen.getByText("Save"));
};

describe("SimsGeographyPicker — création d'un territoire", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(GeographieApi.getAll)
      .mockResolvedValueOnce([france])
      .mockResolvedValue([france, created]);
    // Le back répond l'identifiant du territoire créé, pas son URI.
    vi.mocked(GeographieApi.postTerritory).mockResolvedValue(created.id);
  });

  it("sélectionne l'URI du territoire créé", async () => {
    const onChange = vi.fn();
    renderWithRouterAndQuery(<Sims onChange={onChange} />);
    await waitFor(() => expect(GeographieApi.getAll).toHaveBeenCalledTimes(1));

    createTerritory();

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(created.uri));
  });

  it("affiche dans la liste le territoire créé", async () => {
    renderWithRouterAndQuery(<Sims onChange={vi.fn()} />);
    await waitFor(() => expect(GeographieApi.getAll).toHaveBeenCalledTimes(1));

    createTerritory();

    await waitFor(() =>
      expect(document.querySelector(".p-dropdown-label")).toHaveTextContent(created.labelLg1),
    );
  });
});
