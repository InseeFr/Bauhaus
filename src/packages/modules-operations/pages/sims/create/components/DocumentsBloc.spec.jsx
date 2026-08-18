import { fireEvent, render, screen } from "@testing-library/react";

import { getLang } from "@utils/dictionnary";

import { getListItems } from "@components/ui/list-group/testing";

import { DocumentsStoreProvider } from "../../hooks/useDocumentsStoreContext";
import { DocumentsBloc } from "./DocumentsBloc";

vi.mock("@sdk/build-api", () => ({
  getBaseURI: vi.fn().mockReturnValue("http://base-uri"),
}));

const translations = {
  "documents.addDocument": "Add a document",
  "documents.addLink": "Add a link",
  "documents.titleDocument": "Document",
  "documents.titleLink": "Link",
  "app.btnAdd": "Add",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => translations[key] ?? key,
  }),
}));

const documents = [
  {
    uri: "http://uri1-bis.fr",
    url: "http://google.fr?q=url-1",
    updatedDate: "2019-03-04T10:00:00.000Z",
    labelLg1: "B labelLg1-0",
    labelLg2: "B labelLg2-0",
    lang: "fr",
    descriptionLg1: "descriptionLg1",
    descriptionLg2: "descriptionLg2",
    aside: `fr-${new Intl.DateTimeFormat(getLang()).format(new Date("2019-03-04T10:00:00.000Z"))}`,
  },
  {
    uri: "http://uri2-bis.fr",
    url: "http://google.fr?q=url-2",
    updatedDate: "2019-04-04T10:00:00.000Z",
    labelLg1: "A labelLg1-1",
    labelLg2: "A labelLg2-1",
    descriptionLg1: "descriptionLg1-2",
    descriptionLg2: "descriptionLg2-2",
    aside: `${new Intl.DateTimeFormat(getLang()).format(new Date("2019-04-04T10:00:00.000Z"))}`,
  },
  {
    uri: "http://uri3-bis.fr",
    url: "http://google.fr?q=url-2",
    labelLg1: "Z labelLg1-2",
    labelLg2: "Z labelLg2-2",
    lang: "fr",
    descriptionLg1: "descriptionLg1-2",
    descriptionLg2: "descriptionLg2-2",
    aside: "fr",
  },
];

export const renderWithStore = async (component) =>
  render(
    <DocumentsStoreProvider
      value={{ documentStores: { lg1: documents, lg2: documents } }}
    >
      {component}
    </DocumentsStoreProvider>,
  );

describe("DocumentsBloc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display nothing if the documents props is not defined", async () => {
    const { container } = await renderWithStore(<DocumentsBloc />);
    expect(container.querySelectorAll(".documentsbloc")).toHaveLength(0);
  });

  it("should display nothing if the documents props is an empty array", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={[]} />,
    );
    expect(container.querySelectorAll(".documentsbloc")).toHaveLength(0);
  });

  it("should display three items", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} />,
    );
    expect(container.querySelectorAll("li")).toHaveLength(3);
  });

  // Explicit literals in a deliberately non-alphabetical order (Z before A) so
  // the test cannot be fooled by the shared `documents` array being mutated in
  // place by a previous render. The component must honour the back-defined order
  // and NOT re-sort alphabetically.
  const backOrdered = [
    {
      uri: "http://z.fr",
      url: "http://z",
      labelLg1: "Z first",
      labelLg2: "Z first lg2",
      descriptionLg1: "descZ1",
      descriptionLg2: "descZ2",
      lang: "fr",
      aside: "fr",
    },
    {
      uri: "http://a.fr",
      url: "http://a",
      labelLg1: "A second",
      labelLg2: "A second lg2",
      descriptionLg1: "descA1",
      descriptionLg2: "descA2",
      lang: "fr",
      aside: "fr",
    },
  ];

  it("should display the Lg1 labels in the given array order (back-defined order), not alphabetically", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={backOrdered} />,
    );

    const labels = getListItems(container).map(
      (item) => item.querySelector("a").textContent,
    );
    expect(labels).toEqual(backOrdered.map((doc) => doc.labelLg1));
  });

  it("should display the Lg2 labels in the given array order (back-defined order), not alphabetically", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={backOrdered} localPrefix="Lg2" />,
    );

    const labels = getListItems(container).map(
      (item) => item.querySelector("a").textContent,
    );
    expect(labels).toEqual(backOrdered.map((doc) => doc.labelLg2));
  });

  describe.each`
    lang     | expectedEdit | expectedView
    ${"Lg2"} | ${3}         | ${0}
    ${"Lg1"} | ${3}         | ${0}
  `("$a + $b", ({ lang, expectedEdit, expectedView }) => {
    it("should not display delete buttons", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc
          documents={documents}
          localPrefix={lang}
          editMode={false}
        />,
      );

      expect(container.querySelectorAll(".documentsbloc-delete")).toHaveLength(
        expectedView,
      );
    });

    it("should display zero delete buttons", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc
          documents={documents}
          localPrefix={lang}
          editMode={true}
        />,
      );

      expect(container.querySelectorAll(".documentsbloc-delete")).toHaveLength(
        expectedEdit,
      );
    });
  });

  it("should display the Add Document button if there is not more document to add", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg1" editMode={true} />,
    );

    expect(container.querySelectorAll(".documentsbloc-add")).toHaveLength(1);
  });

  it("should display the Add Document button if there is more than on document available", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg1" editMode={true} />,
    );

    expect(container.querySelectorAll(".documentsbloc-add")).toHaveLength(1);
  });

  it("should display the Add new Document button", async () => {
    const openLateralPanelOpened = vi.fn();
    const setRubricIdForNewDocument = vi.fn();
    render(
      <DocumentsStoreProvider
        value={{
          documentStores: { lg1: [], lg2: [] },
          openLateralPanelOpened,
          setRubricIdForNewDocument,
        }}
      >
        <DocumentsBloc
          documents={documents}
          localPrefix="Lg1"
          editMode={true}
          idMas="1"
        />
      </DocumentsStoreProvider>,
    );

    const btn = screen.getByLabelText(translations["app.btnAdd"]);
    fireEvent.click(btn);
    expect(openLateralPanelOpened).toHaveBeenCalledWith("link");
    expect(setRubricIdForNewDocument).toHaveBeenCalledWith({
      lang: "Lg1",
      rubric: "1",
    });
  });

  it("should not display the Add Document button for Lg2", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc
        documents={documents}
        localPrefix="Lg2"
        editMode={false}
      />,
    );

    expect(container.querySelectorAll(".documentsbloc-add")).toHaveLength(0);
  });

  describe("sortable mode (onReorder provided)", () => {
    it("should render the documents in array order, not sorted by label", async () => {
      // Fresh array: sortArray mutates in place, so a shared array could already
      // be alphabetically ordered by previous tests.
      const unordered = [
        {
          uri: "http://uri-b.fr",
          url: "http://b",
          labelLg1: "B labelLg1-0",
          lang: "fr",
        },
        {
          uri: "http://uri-a.fr",
          url: "http://a",
          labelLg1: "A labelLg1-1",
          lang: "fr",
        },
        {
          uri: "http://uri-z.fr",
          url: "http://z",
          labelLg1: "Z labelLg1-2",
          lang: "fr",
        },
      ];
      const { container } = await renderWithStore(
        <DocumentsBloc
          documents={unordered}
          localPrefix="Lg1"
          editMode={true}
          onReorder={vi.fn()}
        />,
      );

      const labels = [...container.querySelectorAll("li a")].map(
        (a) => a.textContent,
      );
      expect(labels).toEqual(["B labelLg1-0", "A labelLg1-1", "Z labelLg1-2"]);
    });

    it("should display a drag handle for each document", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc
          documents={documents}
          localPrefix="Lg1"
          editMode={true}
          onReorder={vi.fn()}
        />,
      );

      expect(
        container.querySelectorAll(".documentsbloc-drag-handle"),
      ).toHaveLength(documents.length);
    });

    it("should not display drag handles when onReorder is not provided", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc
          documents={documents}
          localPrefix="Lg1"
          editMode={true}
        />,
      );

      expect(
        container.querySelectorAll(".documentsbloc-drag-handle"),
      ).toHaveLength(0);
    });
  });
});
