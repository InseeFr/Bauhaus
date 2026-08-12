import { Document, HomeDocument } from "../../model/operations/document";

export function isDocument(document: Document | HomeDocument) {
  return document?.uri?.includes("/document/");
}
