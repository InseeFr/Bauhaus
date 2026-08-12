import { Document, HomeDocument } from "../../model/operations/document";

export function isLink(document: Document | HomeDocument) {
  return document?.uri?.includes("/page/");
}
