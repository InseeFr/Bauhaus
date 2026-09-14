import { render } from "@testing-library/react";
import { ReactElement } from "react";

import { Rubric } from "@model/Sims";

import { DocumentsStoreProvider } from "../../hooks/useDocumentsStoreContext";
import { SimsBlockRichText } from "./SimsBlockRichText";

export const renderWithStore = (component: ReactElement) => {
  return render(
    <DocumentsStoreProvider
      value={{
        documentStores: { lg1: [], lg2: [] },
        updateDocumentStores: vi.fn(),
        rubricIdForNewDocument: null,
        setRubricIdForNewDocument: vi.fn(),
      }}
    >
      {component}
    </DocumentsStoreProvider>,
  );
};

const documents: Rubric = {
  idAttribute: "1",
  rangeType: "RICH_TEXT",
  labelLg1: "sectionLg1",
  labelLg2: "sectionLg2",
  documentsLg1: [
    {
      labelLg1: "Page 1",
      labelLg2: "Page 2",
      uri: "http://page/1",
      lang: "fr",
    },
    {
      labelLg1: "Document 1",
      labelLg2: "Document 2",
      uri: "http://document/1",
      lang: "fr",
    },
  ],
  documentsLg2: [
    {
      labelLg1: "Page 1",
      labelLg2: "Page 2",
      uri: "http://page/1",
      lang: "fr",
    },
    {
      labelLg1: "Document 1",
      labelLg2: "Document 2",
      uri: "http://document/1",
      lang: "fr",
    },
  ],
};
describe("<SimsBlockRichText />", () => {
  it("should display labelLg1", () => {
    const { container } = renderWithStore(
      <SimsBlockRichText currentSection={documents} isSecondLang={false} />,
    );
    expect(container.querySelector("p")?.innerHTML).toBe("sectionLg1");
  });
  it("should display labelLg2", () => {
    const { container } = renderWithStore(
      <SimsBlockRichText currentSection={documents} isSecondLang={true} />,
    );
    expect(container.querySelector("p")?.innerHTML).toBe("sectionLg2");
  });
  it("should display link/document Lg1", () => {
    const { container } = renderWithStore(
      <SimsBlockRichText currentSection={documents} isSecondLang={false} />,
    );
    expect(container.querySelector(".documentsbloc:nth-child(2) a")?.innerHTML).toBe("Document 1");
    expect(container.querySelector(".documentsbloc:nth-child(4) a")?.innerHTML).toBe("Page 1");
  });
  it("should display link/document Lg2", () => {
    const { container } = renderWithStore(
      <SimsBlockRichText currentSection={documents} isSecondLang={true} />,
    );
    expect(container.querySelector(".documentsbloc:nth-child(2) a")?.innerHTML).toBe("Document 2");
    expect(container.querySelector(".documentsbloc:nth-child(4) a")?.innerHTML).toBe("Page 2");
  });
});
