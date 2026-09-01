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
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { AddLogo } from "@components/logo/logo-add";
import { List } from "@components/ui/list-group";

import { getBaseURI } from "@sdk/build-api";

import { DOCUMENT, LINK } from "../../../../../constants/documentType";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";
import { useDocumentsStoreContext } from "../../hooks/useDocumentsStoreContext";
import { DocumentAsideInformation, DocumentLink } from "./DocumentListItem";
import { SortableDocumentItem } from "./SortableDocumentItem";
import "./DocumentsBloc.css";
import { cx } from "@utils/cx";

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
  const { t } = useTranslation();

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
      aria-label={t("app.btnDelete")}
      onClick={() => deleteHandler(document.uri)}
    >
      <span className="glyphicon glyphicon-trash" aria-hidden="true" />
    </button>
  );

  const [panelStatus, setPanelStatus] = useState(false);

  const [filter, setFilter] = useState("");

  const baseURI = getBaseURI();

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
      <List.Item className="documentbloc-item" key={document.uri}>
        <span>
          <DocumentLink document={document} localPrefix={localPrefix} baseURI={baseURI} />
          <DocumentAsideInformation document={document} />
        </span>
        {editMode && btnBlocFunction(document)}
      </List.Item>
    );
  }

  const addTitle = t(objectType === "documents" ? "documents.addDocument" : "documents.addLink", {
    lng: isSecondLang ? "en" : "fr",
  });

  const title = t(objectType === "documents" ? "documents.titleDocument" : "documents.titleLink");
  return (
    <>
      {(documents.length > 0 || editMode) && <h4>{title}</h4>}
      {documents && documents.length > 0 && sortable && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={currentDocumentsIds} strategy={verticalListSortingStrategy}>
            <List.Container className="documentsbloc">
              {currentDocuments.map((document) => (
                <SortableDocumentItem
                  key={document.uri}
                  document={document}
                  localPrefix={localPrefix}
                  baseURI={baseURI}
                  deleteHandler={deleteHandler}
                />
              ))}
            </List.Container>
          </SortableContext>
        </DndContext>
      )}
      {documents && documents.length > 0 && !sortable && (
        <List.Container className="documentsbloc">
          {currentDocuments.map((document) => displayHTMLForDocument(document))}
        </List.Container>
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
                className={cx("glyphicon", `glyphicon-menu-${panelStatus ? "down" : "right"}`)}
                aria-hidden="true"
              />
              {addTitle} <span className="badge">{otherDocuments.length}</span>
            </button>
            <button
              type="button"
              className="btn"
              aria-label={t("app.btnAdd")}
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
                  {t("app.search")}
                </label>
                <TextInput
                  id="documentFilter"
                  placeholder={t("app.search")}
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
                        aria-label={t("app.btnAdd")}
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
