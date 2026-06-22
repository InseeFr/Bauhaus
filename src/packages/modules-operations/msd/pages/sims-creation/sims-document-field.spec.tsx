import { render } from "@testing-library/react";

import { SimsDocumentField } from "./sims-document-field";

const capturedProps: any[] = [];
vi.mock("../../documents/documents-bloc", () => ({
  DocumentsBloc: (props: any) => {
    capturedProps.push(props);
    return null;
  },
}));

const doc1 = { uri: "http://base/documents/document/1", labelLg1: "Doc 1", lang: "fr" };
const doc2 = { uri: "http://base/documents/document/2", labelLg1: "Doc 2", lang: "fr" };
const link1 = { uri: "http://base/documents/page/1", labelLg1: "Link 1", lang: "fr" };

const blocFor = (objectType: string) =>
  capturedProps.find((props) => props.objectType === objectType);

describe("SimsDocumentField", () => {
  beforeEach(() => {
    capturedProps.length = 0;
  });

  it("reorders documents within the combined array and keeps links in place", () => {
    const handleChange = vi.fn();
    render(
      <SimsDocumentField
        handleChange={handleChange}
        msd={{ idMas: "rubric-1" }}
        currentSection={{ documentsLg1: [doc1, link1, doc2] }}
        lang="Lg1"
      />,
    );

    // move doc2 onto doc1's slot
    blocFor("documents").onReorder(doc2.uri, doc1.uri);

    expect(handleChange).toHaveBeenCalledWith({
      id: "rubric-1",
      override: { documentsLg1: [doc2, link1, doc1] },
    });
  });

  it("reorders links independently of documents", () => {
    const handleChange = vi.fn();
    const link2 = { uri: "http://base/documents/page/2", labelLg1: "Link 2", lang: "fr" };
    render(
      <SimsDocumentField
        handleChange={handleChange}
        msd={{ idMas: "rubric-1" }}
        currentSection={{ documentsLg1: [link1, doc1, link2] }}
        lang="Lg1"
      />,
    );

    blocFor("links").onReorder(link2.uri, link1.uri);

    expect(handleChange).toHaveBeenCalledWith({
      id: "rubric-1",
      override: { documentsLg1: [link2, doc1, link1] },
    });
  });
});
