import { Document, HomeDocument } from "@model/operations/document";

export function isDocument(document: Document | HomeDocument): boolean {
  return document?.uri?.includes("/document/") ?? false;
}
