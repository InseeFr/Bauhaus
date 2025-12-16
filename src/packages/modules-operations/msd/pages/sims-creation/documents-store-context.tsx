import { createContext, useContext } from "react";

import { Document } from "../../../../model/operations/document";
import { DOCUMENT, LINK } from "../../../document/utils";

export interface DocumentsStoreObject {
  lg1: Document[];
  lg2: Document[];
}
export interface DocumentsStoreContextType {
  documentStores: DocumentsStoreObject;
  updateDocumentStores: (store: DocumentsStoreObject) => void;
  lateralPanelOpened?: typeof DOCUMENT | typeof LINK;
  onLateralPanelHide?: VoidFunction;
  openLateralPanelOpened?: (type: typeof DOCUMENT | typeof LINK) => void;
  rubricIdForNewDocument: { rubric: string; lang: string } | null;
  setRubricIdForNewDocument: (value: { rubric: string; lang: string } | null) => void;
}
const DocumentsStoreContext = createContext<DocumentsStoreContextType | undefined>(undefined);

export const DocumentsStoreProvider = DocumentsStoreContext.Provider;

export const useDocumentsStoreContext = (): DocumentsStoreContextType => {
  const context = useContext(DocumentsStoreContext);
  if (!context) {
    throw new Error("The context DocumentsStoreContext is not available.");
  }
  return context;
};
