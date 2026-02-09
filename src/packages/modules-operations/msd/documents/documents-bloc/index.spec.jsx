import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { getBaseURI } from "@sdk/build-api";

import { sortArray } from "@utils/array-utils";
import { getLang } from "@utils/dictionnary";

import D from "../../../../deprecated-locales";
import { DocumentsStoreProvider } from "../../pages/sims-creation/documents-store-context";
import { DocumentsBloc } from "./index";

vi.mock("@sdk/build-api", () => ({
  getBaseURI: vi.fn().mockResolvedValue("http://base-uri"),
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

export const renderWithStore = async (component) => {
  const result = render(
    <DocumentsStoreProvider value={{ documentStores: { lg1: documents, lg2: documents } }}>
      {component}
    </DocumentsStoreProvider>,
  );
  await waitFor(() => {
    expect(getBaseURI).toHaveBeenCalled();
  });
  return result;
};

describe("DocumentsBloc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display nothing if the documents props is not defined", async () => {
    const { container } = await renderWithStore(<DocumentsBloc />);
    expect(container.querySelectorAll(".documentsbloc")).toHaveLength(0);
  });

  it("should display nothing if the documents props is an empty array", async () => {
    const { container } = await renderWithStore(<DocumentsBloc documents={[]} />);
    expect(container.querySelectorAll(".documentsbloc")).toHaveLength(0);
  });

  it("should display three items", async () => {
    const { container } = await renderWithStore(<DocumentsBloc documents={documents} />);
    expect(container.querySelectorAll("li")).toHaveLength(3);
  });

  it("should display the Lg1 label and description ordered by label", async () => {
    const { container } = await renderWithStore(<DocumentsBloc documents={documents} />);
    const orderedList = sortArray("labelLg1")(documents);

    const lis = container.querySelectorAll("li");
    for (let i = 0; i < lis.length; i++) {
      expect(lis[i].outerHTML).toEqual(
        `<li class="list-group-item documentbloc__item"><span><a target="_blank" rel="noreferrer noopener" href="${orderedList[i].url}" title="${orderedList[i].descriptionLg1}">${orderedList[i].labelLg1}</a><i>(${orderedList[i].aside})</i></span></li>`,
      );
    }
  });

  it("should display the Lg2 label and description ordered by label", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg2" />,
    );
    const orderedList = sortArray("labelLg2")(documents);

    const lis = container.querySelectorAll("li");
    for (let i = 0; i < lis.length; i++) {
      expect(lis[i].outerHTML).toEqual(
        `<li class="list-group-item documentbloc__item"><span><a target="_blank" rel="noreferrer noopener" href="${orderedList[i].url}" title="${orderedList[i].descriptionLg2}">${orderedList[i].labelLg2}</a><i>(${orderedList[i].aside})</i></span></li>`,
      );
    }
  });

  describe.each`
    lang     | expectedEdit | expectedView
    ${"Lg2"} | ${3}         | ${0}
    ${"Lg1"} | ${3}         | ${0}
  `("$a + $b", ({ lang, expectedEdit, expectedView }) => {
    it("should not display delete buttons", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc documents={documents} localPrefix={lang} editMode={false} />,
      );

      expect(container.querySelectorAll(".documentsbloc__delete")).toHaveLength(expectedView);
    });

    it("should display zero delete buttons", async () => {
      const { container } = await renderWithStore(
        <DocumentsBloc documents={documents} localPrefix={lang} editMode={true} />,
      );

      expect(container.querySelectorAll(".documentsbloc__delete")).toHaveLength(expectedEdit);
    });
  });

  it("should display the Add Document button if there is not more document to add", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg1" editMode={true} />,
    );

    expect(container.querySelectorAll(".documentsbloc__add")).toHaveLength(1);
  });

  it("should display the Add Document button if there is more than on document available", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg1" editMode={true} />,
    );

    expect(container.querySelectorAll(".documentsbloc__add")).toHaveLength(1);
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
        <DocumentsBloc documents={documents} localPrefix="Lg1" editMode={true} idMas="1" />
      </DocumentsStoreProvider>,
    );

    await waitFor(() => {
      expect(getBaseURI).toHaveBeenCalled();
    });

    const btn = screen.getByLabelText(D.btnAdd);
    fireEvent.click(btn);
    expect(openLateralPanelOpened).toHaveBeenCalledWith("link");
    expect(setRubricIdForNewDocument).toHaveBeenCalledWith({
      lang: "Lg1",
      rubric: "1",
    });
  });

  it("should not display the Add Document button for Lg2", async () => {
    const { container } = await renderWithStore(
      <DocumentsBloc documents={documents} localPrefix="Lg2" editMode={false} />,
    );

    expect(container.querySelectorAll(".documentsbloc__add")).toHaveLength(0);
  });
});
