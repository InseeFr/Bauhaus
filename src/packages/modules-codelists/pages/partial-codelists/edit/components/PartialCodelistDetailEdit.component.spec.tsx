import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Mock, vi } from "vitest";

import { DisseminationStatus } from "@sdk/dissemination-status";
import { CodelistsApi } from "@sdk/index";

import { AppContextProvider } from "../../../../../application/app-context";
import { testsI18n as i18n } from "../../../../../tests/i18n";
import { PartialCodelistDetailEdit } from "./PartialCodelistDetailEdit";

vi.mock("@sdk/index", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@sdk/index")>()),
  CodelistsApi: { getCodelistCodes: vi.fn() },
}));

vi.mock("@sdk/dissemination-status", () => ({
  DisseminationStatus: { getDisseminationStatus: vi.fn() },
}));

vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("../../../../../auth/components/auth", () => ({ useAuthorizationGuard: () => true }));

vi.mock("@utils/creation/use-default-contributor", () => ({
  useDefaultContributor: () => "DG75-L201",
}));

const globalCodelistOptions = [
  { value: "CL_PARENT", label: "Liste globale", iriParent: "http://codelist/CL_PARENT" },
];

const parentCodes = [
  { code: "B", labelLg1: "Beta" },
  { code: "A", labelLg1: "Alpha" },
];

const renderForm = (props: Partial<Parameters<typeof PartialCodelistDetailEdit>[0]> = {}) => {
  const handleSave = vi.fn();
  const handleBack = vi.fn();
  const rendered = render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
            <PartialCodelistDetailEdit
              codelist={{}}
              handleSave={handleSave}
              handleBack={handleBack}
              updateMode={false}
              globalCodelistOptions={globalCodelistOptions}
              {...props}
            />
          </AppContextProvider>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return { ...rendered, handleSave, handleBack };
};

// `LabelRequired` suffixe l'intitulé d'un astérisque : la correspondance exacte
// de `getByLabelText` ne marcherait pas sur les champs obligatoires.
const field = (label: string) => screen.getAllByLabelText(new RegExp(`^${label}`))[0];

const pickParentCodelist = async () => {
  const group = screen.getByText("Parent codelist").closest(".form-group")!;
  fireEvent.click(group.querySelector(".p-dropdown-trigger")!);
  fireEvent.click(await screen.findByText("Liste globale"));
};

describe("Partial codelist edition form", () => {
  beforeEach(() => {
    (CodelistsApi.getCodelistCodes as Mock).mockResolvedValue({ items: parentCodes });
    (DisseminationStatus.getDisseminationStatus as Mock).mockResolvedValue([
      { url: "http://status/public", label: "Public generic" },
    ]);
  });

  it("announces a creation and lets the identifier be typed", () => {
    renderForm();

    expect(screen.getByText("Create a new partial codelist")).toBeInTheDocument();
    expect(field("Identifier")).toBeEnabled();
  });

  it("shows the labels of the codelist being updated and freezes its identity", () => {
    renderForm({
      updateMode: true,
      codelist: { id: "CL_PARTIAL", labelLg1: "Partielle", labelLg2: "Partial" },
    });

    expect(screen.getByRole("heading", { name: "Partielle" })).toBeInTheDocument();
    expect(field("Identifier")).toBeDisabled();
  });

  it.each([
    ["Identifier", "CL_PARTIAL"],
    ["Libellé", "Partielle"],
    ["Label", "Partial"],
    ["Description", "Une description"],
  ])("keeps the %s typed in the form", (label, value) => {
    renderForm();

    const input = field(label);
    fireEvent.change(input, { target: { value } });

    expect(input).toHaveValue(value);
  });

  it("refuses to save an incomplete codelist and lists the missing fields", async () => {
    const { handleSave } = renderForm();

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("goes back without saving when the edition is cancelled", () => {
    const { handleBack, handleSave } = renderForm();

    fireEvent.click(screen.getByText("Cancel"));

    expect(handleBack).toHaveBeenCalled();
    expect(handleSave).not.toHaveBeenCalled();
  });

  it("displays the server side error raised by a previous save", () => {
    renderForm({ serverSideError: "The identifier already exists" });

    expect(screen.getByText("The identifier already exists")).toBeInTheDocument();
  });

  it("loads and sorts the codes of the parent codelist once it is picked", async () => {
    renderForm();

    await pickParentCodelist();

    await waitFor(() =>
      expect(CodelistsApi.getCodelistCodes).toHaveBeenCalledWith("CL_PARENT", 1, 0),
    );
    const codes = await screen.findAllByText(/Alpha|Beta/);
    expect(codes.map((code) => code.textContent?.trim())).toEqual(["Alpha", "Beta"]);
  });

  it("loads the codes of the parent codelist of an existing partial codelist", async () => {
    renderForm({ updateMode: true, codelist: { id: "CL_PARTIAL", parentCode: "CL_PARENT" } });

    await waitFor(() =>
      expect(CodelistsApi.getCodelistCodes).toHaveBeenCalledWith("CL_PARENT", 1, 0),
    );
  });

  it("moves a single code in and out of the partial codelist", async () => {
    const { container } = renderForm();

    await pickParentCodelist();
    const selected = () =>
      Array.from(container.querySelectorAll(".panel .picker-item, .card-body li")).map(
        (item) => item.textContent,
      );

    fireEvent.click(await screen.findByText("Alpha"));
    await waitFor(() => expect(selected().join()).toContain("Alpha"));

    fireEvent.click(screen.getByText("Alpha"));
    await waitFor(() => expect(selected().join()).not.toContain("Alpha"));
  });

  it("moves every code in and out of the partial codelist at once", async () => {
    renderForm();

    await pickParentCodelist();
    await screen.findByText("Alpha");

    fireEvent.click(screen.getByText("Add all codes"));
    await waitFor(() => expect(screen.getAllByText(/Alpha|Beta/)).toHaveLength(2));

    fireEvent.click(screen.getByText("Remove all the codes"));
    await waitFor(() => expect(screen.getAllByText(/Alpha|Beta/)).toHaveLength(2));
  });

  it("filters the codes left to pick on their label", async () => {
    renderForm();

    await pickParentCodelist();
    await screen.findByText("Alpha");

    fireEvent.change(screen.getByPlaceholderText("Enter the label of a code..."), {
      target: { value: "alp" },
    });

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("saves the codelist and the codes picked for it once every field is filled", async () => {
    const { handleSave } = renderForm();

    fireEvent.change(field("Identifier"), { target: { value: "CL_PARTIAL" } });
    fireEvent.change(field("Libellé"), { target: { value: "Partielle" } });
    fireEvent.change(field("Label"), { target: { value: "Partial" } });
    await pickParentCodelist();

    // Les options de timbre viennent du mock global de `useV2StampsOptions` (setupTests).
    const owner = screen.getByText("Owner").closest("label")!;
    fireEvent.click(owner.querySelector(".p-dropdown-trigger")!);
    fireEvent.click(await screen.findByText("INSEE"));

    const status = screen.getByText("Dissemination status").closest(".form-group")!;
    fireEvent.click(status.querySelector(".p-dropdown-trigger")!);
    fireEvent.click(await screen.findByText("Public generic"));

    fireEvent.click(await screen.findByText("Alpha"));
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(handleSave).toHaveBeenCalled());
    const [saved, codes] = handleSave.mock.calls[0];
    expect(saved).toMatchObject({
      id: "CL_PARTIAL",
      labelLg1: "Partielle",
      labelLg2: "Partial",
      parentCode: "CL_PARENT",
      iriParent: "http://codelist/CL_PARENT",
      creator: "DG75-L201",
      disseminationStatus: "http://status/public",
    });
    expect(codes.filter((code: { isPartial: boolean }) => code.isPartial)).toHaveLength(1);
  });
});
