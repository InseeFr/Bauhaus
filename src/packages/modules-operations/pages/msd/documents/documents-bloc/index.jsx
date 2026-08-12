import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import { TextInput } from "@components/form/input";
import { AddLogo } from "@components/logo/logo-add";

import { getBaseURI } from "@sdk/build-api";

import D, { D1, D2 } from "../../../../../deprecated-locales";
import { DOCUMENT, LINK } from "../../../../constants/documentType";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";
import { useDocumentsStoreContext } from "../../pages/sims-creation/documents-store-context";
import { DocumentAsideInformation, DocumentLink } from "./document-list-item";
import { SortableDocumentItem } from "./sortable-document-item";
import "./style.css";

/**
 * This component will display a list of documents associated
 * to a RICH_TEXT typed rubric of a SIMS
 *
 * @param {DocumentsBlocProps} props
 */
export function DocumentsBloc({
  documents = [],
  localPrefix = "Lg1",
  editMode = false,
  deleteHandler,
  addHandler,
  onReorder,
  objectType,
  idMas,
}) {
  const { documentStores, openLateralPanelOpened, setRubricIdForNewDocument } =
    useDocumentsStoreContext();

  const sortable = editMode && !!onReorder;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id);
    }
  };

  const defaultBtnBlocFunction = (document) => (
    <button
      type="button"
      className="documentsbloc-delete documentsbloc-btn"
      aria-label={D.btnDelete}
      onClick={() => deleteHandler(document.uri)}
    >
      <span className="glyphicon glyphicon-trash" aria-hidden="true" />
    </button>
  );

  const [panelStatus, setPanelStatus] = useState(false);
  const [filter, setFilter] = useState("");

  const [baseURI, setBaseURI] = useState("");
  useEffect(() => {
    getBaseURI().then((uri) => setBaseURI(uri));
  });

  // The array order is the source of truth: chosen by drag-and-drop in edit
  // mode, and provided already ordered by the back in visualisation. We never
  // re-sort alphabetically, otherwise the back-defined order would be lost.
  const currentDocuments = documents;
  const currentDocumentsIds = currentDocuments.map((doc) => doc.uri);

  const otherDocuments = documentStores[localPrefix.toLowerCase()]
    .filter((document) => !currentDocumentsIds.includes(document.uri))
    .filter((document) => !!document["label" + localPrefix])
    .filter((document) => (objectType === "documents" ? isDocument(document) : isLink(document)))
    .filter((document) =>
      document["label" + localPrefix].toLowerCase().includes(filter.toLowerCase()),
    );

  const isSecondLang = localPrefix === "Lg2";

  function displayHTMLForDocument(document, btnBlocFunction = defaultBtnBlocFunction) {
    return (
      <li className="list-group-item documentbloc-item" key={document.uri}>
        <span>
          <DocumentLink document={document} localPrefix={localPrefix} baseURI={baseURI} />

          <DocumentAsideInformation document={document} />
        </span>
        {editMode && btnBlocFunction(document)}
      </li>
    );
  }
  const Dictionary = isSecondLang ? D2 : D1;
  const addTitle = objectType === "documents" ? Dictionary.addDocument : Dictionary.addLink;
  const title = objectType === "documents" ? D.titleDocument : D.titleLink;
  return (
    <>
      {(documents.length > 0 || editMode) && <h4>{title}</h4>}
      {documents && documents.length > 0 && sortable && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentDocumentsIds} strategy={verticalListSortingStrategy}>
            <ul className="documentsbloc list-group">
              {currentDocuments.map((document) => (
                <SortableDocumentItem
                  key={document.uri}
                  document={document}
                  localPrefix={localPrefix}
                  baseURI={baseURI}
                  deleteHandler={deleteHandler}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
      {documents && documents.length > 0 && !sortable && (
        <ul className="documentsbloc list-group">
          {currentDocuments.map((document) => displayHTMLForDocument(document))}
        </ul>
      )}
      {editMode && (
        <div className="documentblock-picker panel panel-default">
          <div className="panel-heading">
            <button
              type="button"
              className="btn documentsbloc-add documentsbloc-btn"
              aria-label={addTitle}
              onClick={() => setPanelStatus(!panelStatus)}
            >
              <span
                className={`glyphicon glyphicon-menu-${panelStatus ? "down" : "right"}`}
                aria-hidden="true"
              />
              {addTitle} <span className="badge">{otherDocuments.length}</span>
            </button>
            <button
              type="button"
              className="btn"
              aria-label={D.btnAdd}
              onClick={() => {
                openLateralPanelOpened(objectType === "documents" ? DOCUMENT : LINK);
                setRubricIdForNewDocument({ rubric: idMas, lang: localPrefix });
              }}
            >
              <AddLogo />
            </button>
          </div>
          {panelStatus && (
            <div className="panel-body">
              <div className="form-group">
                <label className="sr-only" htmlFor="documentFilter">
                  {D.search}
                </label>
                <TextInput
                  id="documentFilter"
                  placeholder={D.search}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
              <ul className="documentsbloc-filepicker">
                {otherDocuments
                  .filter((_, index) => index < 100)
                  .map((document) => {
                    return displayHTMLForDocument(document, (document) => (
                      <button
                        type="button"
                        className="documentsbloc-delete documentsbloc-btn"
                        aria-label={D.btnAdd}
                        onClick={() => addHandler(document)}
                      >
                        <AddLogo />
                      </button>
                    ));
                  })}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
