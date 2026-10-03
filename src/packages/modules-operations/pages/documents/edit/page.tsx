import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Document } from "@model/operations/document";

import { GeneralApi } from "@sdk/general-api";

import { useCodelist } from "@utils/hooks/codelist";

import { OperationsDocumentationEdition } from "./components/OperationsDocumentationEdition";

export const Component = (props: any) => {
  const { id } = useParams<{ id: string }>();

  const { pathname } = useLocation();

  const type = /(link|document)/.exec(pathname)![1];

  const langOptions = useCodelist("ISO-639");

  const [document, setDocument] = useState<Partial<Document>>({});

  const [loadError, setLoadError] = useState<unknown>();

  useEffect(() => {
    if (id && type) {
      GeneralApi.getDocument(id, type)
        .then((results: unknown) => {
          const result = results as Document;
          setDocument({
            ...result,
            id: result.uri!.substring(result.uri!.lastIndexOf("/") + 1),
          });
        })
        .catch(setLoadError);
    }
  }, [id, type]);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!document.id && id) return <Loading />;

  return (
    <OperationsDocumentationEdition
      document={document}
      langOptions={langOptions}
      id={id}
      type={type}
      {...props}
    />
  );
};
