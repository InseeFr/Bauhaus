import { Document, HomeDocument } from "../../model/operations/document";

export function isLink(document: Document | HomeDocument): boolean {
  return document?.uri?.includes("/page/") ?? false;
}
