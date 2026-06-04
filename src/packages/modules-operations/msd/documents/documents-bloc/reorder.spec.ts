import { Document } from "../../../../model/operations/document";
import { isDocument, isLink } from "../../../document/utils";
import { reorderDocuments } from "./reorder";

const doc = (n: number): Document =>
  ({
    uri: `http://base/documents/document/${n}`,
    labelLg1: `Document ${n}`,
    lang: "fr",
  }) as Document;
const link = (n: number): Document =>
  ({ uri: `http://base/documents/page/${n}`, labelLg1: `Page ${n}`, lang: "fr" }) as Document;

describe("reorderDocuments", () => {
  it("moves a document to the slot of another document inside its subset", () => {
    const combined = [doc(1), doc(2), doc(3)];
    const result = reorderDocuments(combined, isDocument, doc(1).uri!, doc(3).uri!);
    expect(result.map((d) => d.uri)).toEqual([doc(2).uri, doc(3).uri, doc(1).uri]);
  });

  it("only reorders the targeted subset and keeps the other subset items in place", () => {
    // combined array interleaves documents and links
    const combined = [doc(1), link(1), doc(2), link(2)];
    const result = reorderDocuments(combined, isDocument, doc(2).uri!, doc(1).uri!);
    // documents reordered to [2, 1]; links keep their absolute slots (index 1 and 3)
    expect(result.map((d) => d.uri)).toEqual([doc(2).uri, link(1).uri, doc(1).uri, link(2).uri]);
  });

  it("reorders links independently of documents", () => {
    const combined = [doc(1), link(1), link(2)];
    const result = reorderDocuments(combined, isLink, link(2).uri!, link(1).uri!);
    expect(result.map((d) => d.uri)).toEqual([doc(1).uri, link(2).uri, link(1).uri]);
  });

  it("returns the original array when active and over are identical", () => {
    const combined = [doc(1), doc(2)];
    const result = reorderDocuments(combined, isDocument, doc(1).uri!, doc(1).uri!);
    expect(result).toBe(combined);
  });

  it("returns the original array when an uri is not found in the subset", () => {
    const combined = [doc(1), doc(2)];
    const result = reorderDocuments(combined, isDocument, doc(1).uri!, "http://unknown");
    expect(result).toBe(combined);
  });

  it("does not mutate the input array", () => {
    const combined = [doc(1), doc(2), doc(3)];
    const snapshot = combined.map((d) => d.uri);
    reorderDocuments(combined, isDocument, doc(1).uri!, doc(3).uri!);
    expect(combined.map((d) => d.uri)).toEqual(snapshot);
  });
});
