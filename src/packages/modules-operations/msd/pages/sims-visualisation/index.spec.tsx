import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-modal", () => ({
  default: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div>{children}</div> : null,
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, params: Record<string, string>) =>
      `${key}[id=${params?.id},href=${params?.href}]`,
  }),
}));

vi.mock("@utils/hooks/second-lang", () => ({
  useSecondLang: () => [false],
}));

vi.mock("../../utils", () => ({
  getParentUri: vi.fn((sims) => {
    if (sims.idOperation) return `/operations/operation/${sims.idOperation}`;
    if (sims.idSeries) return `/operations/series/${sims.idSeries}`;
    if (sims.idIndicator) return `/operations/indicator/${sims.idIndicator}`;
    return undefined;
  }),
  hasLabelLg2: vi.fn(() => false),
}));

vi.mock("./menu", () => ({
  Menu: ({ onPublish, onDelete }: { onPublish: () => void; onDelete: () => void }) => (
    <>
      <button data-testid="publish-btn" onClick={onPublish}>
        Publish
      </button>
      <button data-testid="delete-btn" onClick={onDelete}>
        Delete
      </button>
    </>
  ),
}));

vi.mock("@components/errors-bloc", () => ({
  ErrorBloc: ({ error }: { error: string[] }) => (
    <div data-testid="error-bloc">{error?.join(", ")}</div>
  ),
}));

vi.mock("@components/action-toolbar", () => ({
  ActionToolbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@components/buttons/button", () => ({
  Button: ({ children, action }: { children: React.ReactNode; action: () => void }) => (
    <button onClick={action}>{children}</button>
  ),
}));
vi.mock("@components/buttons/buttons-with-icons", () => ({
  CancelButton: () => null,
  CloseIconButton: () => null,
}));
vi.mock("@components/check-second-lang", () => ({ CheckSecondLang: () => null }));
vi.mock("@components/confirmation-delete", () => ({
  ConfirmationDelete: ({ handleYes }: { handleYes: () => void }) => (
    <button data-testid="confirm-delete-btn" onClick={handleYes}>
      Confirm
    </button>
  ),
}));
vi.mock("@components/creation-update-items", () => ({ CreationUpdateItems: () => null }));
vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@components/note", () => ({ Note: () => null }));
vi.mock("@components/panel", () => ({ Panel: () => null }));
vi.mock("@components/status", () => ({ PublicationFemale: () => null }));
vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { deleteSims: vi.fn(() => Promise.resolve()) },
}));
vi.mock("../../rubric-essantial-msg", () => ({ RubricEssentialMsg: () => null }));
vi.mock("../../sims-field-title", () => ({ SimsFieldTitle: () => null }));
vi.mock("./sims-block", () => ({ default: () => null }));
vi.mock("./missing-documents-error-bloc", () => ({
  MissingDocumentsErrorBloc: ({ missingDocuments }: { missingDocuments: Set<string> }) =>
    missingDocuments && missingDocuments.size > 0 ? (
      <div data-testid="missing-documents-bloc">{Array.from(missingDocuments).join(",")}</div>
    ) : null,
}));
vi.mock("../../../../deprecated-locales", () => ({ default: {} }));

import SimsVisualisation from "./index";

const mockSims = {
  id: "2253",
  idSeries: "s1034",
  rubrics: {},
};

const renderComponent = (
  publishSims: ReturnType<typeof vi.fn>,
  sims: Record<string, unknown> = mockSims,
) => {
  return render(
    <SimsVisualisation
      sims={sims as any}
      metadataStructure={{}}
      codesLists={{}}
      organisations={[]}
      publishSims={publishSims}
      exportCallback={vi.fn()}
      missingDocuments={new Set()}
      owners={[]}
    />,
  );
};

beforeEach(() => {
  navigateMock.mockClear();
});

describe("SimsVisualisation - publish error handling", () => {
  it("should show error 804 with parsed target id and parent href when publish fails", () => {
    const publishSims = vi.fn((object, errorCallback) => {
      errorCallback({
        code: 804,
        details: "MetadataReport: 2253 ; Indicator/Series/Operation: s1034",
        message: "This metadataReport cannot be published before its target is published.",
      });
    });

    renderComponent(publishSims);
    fireEvent.click(screen.getByTestId("publish-btn"));

    expect(screen.getByTestId("error-bloc")).toHaveTextContent(
      "errors.804[id=s1034,href=/operations/series/s1034]",
    );
  });

  it("should display the missing documents bloc when publish fails because documents are missing", () => {
    const publishSims = vi.fn((object, errorCallback) => {
      errorCallback({
        code: 862,
        details: '["1","3"]',
        message: "Some documents referenced by this metadataReport are missing from storage",
      });
    });

    renderComponent(publishSims);
    fireEvent.click(screen.getByTestId("publish-btn"));

    expect(screen.getByTestId("missing-documents-bloc")).toHaveTextContent("1,3");
    // the generic error bloc must stay empty in that case
    expect(screen.getByTestId("error-bloc")).toBeEmptyDOMElement();
  });

  it("should call publishSims with the sims object", () => {
    const publishSims = vi.fn();

    renderComponent(publishSims);
    fireEvent.click(screen.getByTestId("publish-btn"));

    expect(publishSims).toHaveBeenCalledWith(mockSims, expect.any(Function));
  });

  it("should not show an error when publishSims succeeds", () => {
    const publishSims = vi.fn();

    renderComponent(publishSims);
    fireEvent.click(screen.getByTestId("publish-btn"));

    expect(screen.getByTestId("error-bloc")).toBeEmptyDOMElement();
  });

  it("should handle missing details in the error gracefully", () => {
    const publishSims = vi.fn((object, errorCallback) => {
      errorCallback({ code: 804, details: undefined, message: "error" });
    });

    renderComponent(publishSims);
    fireEvent.click(screen.getByTestId("publish-btn"));

    expect(screen.getByTestId("error-bloc")).toHaveTextContent(
      "errors.804[id=undefined,href=/operations/series/s1034]",
    );
  });
});

describe("SimsVisualisation - delete redirection", () => {
  it("should navigate to the parent series after deleting a SIMS that documents a series", async () => {
    renderComponent(vi.fn(), { id: "1", idSeries: "s42", rubrics: {} });

    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/operations/series/s42");
    });
  });

  it("should navigate to the parent operation after deleting a SIMS that documents an operation", async () => {
    renderComponent(vi.fn(), { id: "2", idOperation: "op42", rubrics: {} });

    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/operations/operation/op42");
    });
  });

  it("should navigate to the parent indicator after deleting a SIMS that documents an indicator", async () => {
    renderComponent(vi.fn(), { id: "3", idIndicator: "ind42", rubrics: {} });

    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("confirm-delete-btn"));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/operations/indicator/ind42");
    });
  });
});
