import { useMemo } from "react";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { HomeDocument } from "@model/operations/document";

import { sortArray } from "@utils/array-utils";
import { useDocumentsAndLinks } from "@utils/hooks/documents";

import { DocumentHome } from "./components/DocumentHome";

const sortByLabel = sortArray("label");

export const Component = () => {
  const { data, isLoading, error } = useDocumentsAndLinks();

  const documents = useMemo<HomeDocument[]>(
    () =>
      sortByLabel(
        (data ?? []).map((document) => ({
          label: (document.labelLg1 || document.labelLg2).trim(),
          uri: document.uri ?? "",
          lang: document.lang,
          updatedDate: document.updatedDate ?? "",
          id: document.uri?.substr(document.uri.lastIndexOf("/") + 1) ?? "",
        })),
      ),
    [data],
  );

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

  return <DocumentHome documents={documents} />;
};
