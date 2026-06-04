import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Document } from "../../../../model/operations/document";
import D from "../../../../deprecated-locales";
import { DocumentAsideInformation, DocumentLink } from "./document-list-item";

interface SortableDocumentItemProps {
  document: Document;
  localPrefix: "Lg1" | "Lg2";
  baseURI: string;
  deleteHandler: (uri?: string) => void;
}

/**
 * A document list item that can be dragged to reorder it within its bloc.
 * The drag handle isolates the drag interaction from the document link and the
 * delete button so they stay clickable.
 */
export const SortableDocumentItem = ({
  document,
  localPrefix,
  baseURI,
  deleteHandler,
}: Readonly<SortableDocumentItemProps>) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: document.uri as string,
  });

  const style = {
    // Translate only: CSS.Transform also applies scaleX/scaleY when items differ
    // in size, which stretches/deforms the text while dragging.
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="list-group-item documentbloc__item documentbloc__item--sortable"
    >
      <button
        type="button"
        className="documentsbloc__drag-handle documentsbloc__btn"
        aria-label={D.reorderDocument}
        {...attributes}
        {...listeners}
      >
        <span className="glyphicon glyphicon-menu-hamburger" aria-hidden="true" />
      </button>
      <span>
        <DocumentLink document={document} localPrefix={localPrefix} baseURI={baseURI} />
        <DocumentAsideInformation document={document} />
      </span>
      <button
        type="button"
        className="documentsbloc__delete documentsbloc__btn"
        aria-label={D.btnDelete}
        onClick={() => deleteHandler(document.uri)}
      >
        <span className="glyphicon glyphicon-trash" aria-hidden="true" />
      </button>
    </li>
  );
};
