import { useEffect, useState } from "react";

import { Document } from "@model/operations/document";

import { GeneralApi } from "@sdk/general-api";

import { sortArray } from "@utils/array-utils";

import { DocumentsStoreObject } from "./useDocumentsStoreContext";

export const useDocumentsList = () => {
  const [documentStores, setDocumentStores] = useState<DocumentsStoreObject>({
    lg1: [],
    lg2: [],
  });

  useEffect(() => {
    getDocumentsList().then(setDocumentStores);
  }, []);

  return { documentStores, setDocumentStores };
};

export const getDocumentsList = (): Promise<DocumentsStoreObject> => {
  return GeneralApi.getDocumentsList().then((results: any) => {
    const unSortedDocuments: Document[] = results.map((document: Document) => {
      return {
        ...document,
        id: document.uri!.substr(document.uri!.lastIndexOf("/") + 1),
      };
    });
    return {
      lg1: sortArray("labelLg1")(unSortedDocuments),
      lg2: sortArray("labelLg2")(unSortedDocuments),
    };
  });
};
