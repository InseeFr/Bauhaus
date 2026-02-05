import { useEffect, useState } from "react";

import { Loading } from "@components/loading";

import { GeneralApi } from "@sdk/general-api";

import { Document } from "../../model/operations/document";
import { sortArray } from "../../utils/array-utils";
import DocumentHome from "./home";

const sortByLabel = sortArray("label");

export const Component = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GeneralApi.getDocumentsList()
      .then((results) => {
        const sortedDocuments = sortByLabel(
          (results as Document[]).map((document) => {
            return {
              label: (document.labelLg1 || document.labelLg2).trim(),
              uri: document.uri,
              lang: document.lang,
              updatedDate: document.updatedDate,
              id: document.uri?.substr(document.uri.lastIndexOf("/") + 1),
            };
          }),
        );
        setDocuments(sortedDocuments);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  return <DocumentHome documents={documents} />;
};
