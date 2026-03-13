import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-modal", () => ({
  default: ({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) =>
    isOpen ? <div>{children}</div> : null,
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
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
  getParentUri: vi.fn((sims) => `/operations/series/${sims.idSeries}`),
  hasLabelLg2: vi.fn(() => false),
}));

vi.mock("./menu", () => ({
  Menu: ({ onPublish }: { onPublish: () => void }) => (
    <button data-testid="publish-btn" onClick={onPublish}>
      Publish
    </button>
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
vi.mock("@components/confirmation-delete", () => ({ ConfirmationDelete: () => null }));
vi.mock("@components/creation-update-items", () => ({ CreationUpdateItems: () => null }));
vi.mock("@components/layout", () => ({
  Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@components/note", () => ({ Note: () => null }));
vi.mock("@components/panel", () => ({ Panel: () => null }));
vi.mock("@components/status", () => ({ PublicationFemale: () => null }));
vi.mock("@sdk/operations-api", () => ({ OperationsApi: { deleteSims: vi.fn() } }));
vi.mock("../../rubric-essantial-msg", () => ({ RubricEssentialMsg: () => null }));
vi.mock("../../sims-field-title", () => ({ SimsFieldTitle: () => null }));
vi.mock("./sims-block", () => ({ default: () => null }));
vi.mock("./missing-documents-error-bloc", () => ({ MissingDocumentsErrorBloc: () => null }));
vi.mock("../../../../deprecated-locales", () => ({ default: {} }));

import SimsVisualisation from "./index";

const mockSims = {
  id: "2253",
  idSeries: "s1034",
  rubrics: {},
};

const renderComponent = (publishSims: ReturnType<typeof vi.fn>) => {
  return render(
    <SimsVisualisation
      sims={mockSims as any}
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
