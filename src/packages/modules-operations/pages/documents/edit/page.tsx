import { useLocation, useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Document } from "@model/operations/document";

import { useCodelist } from "@utils/hooks/codelist";
import { useDocument } from "@utils/hooks/documents";

import { OperationsDocumentationEdition } from "./components/OperationsDocumentationEdition";

/** Formulaire vide de la création, stable d'un rendu à l'autre. */
const NEW_DOCUMENT: Partial<Document> = {};

export const Component = (props: any) => {
  const { id } = useParams<{ id: string }>();

  const { pathname } = useLocation();

  const type = /(link|document)/.exec(pathname)![1];

  const langOptions = useCodelist("ISO-639");

  const { data: document = NEW_DOCUMENT, error: loadError } = useDocument(id, type);

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
