import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { CheckSecondLang } from "@components/check-second-lang";
import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { Document } from "@model/operations/document";

import { GeneralApi } from "@sdk/general-api";

import { useCodelist } from "@utils/hooks/codelist";
import { useSecondLang } from "@utils/hooks/second-lang";

import { OperationsDocumentationVisualization } from "./components/OperationsDocumentationVisualization";
import { Menu } from "./menu";

function getPath(path: string) {
  return path.includes("document") ? "document" : "link";
}

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const { pathname } = useLocation();

  const type = getPath(pathname);

  const [secondLang] = useSecondLang();

  const langOptions = useCodelist("ISO-639");

  const [document, setDocument] = useState<Document>();
  useEffect(() => {
    GeneralApi.getDocument(id, type).then((results: unknown) => {
      const result = results as Document;
      setDocument({
        ...result,
        id: result.uri!.substr(result.uri!.lastIndexOf("/") + 1),
      });
    });
  }, [id, type]);

  if (!document) return <Loading />;

  return (
    <div className="container">
      <PageTitleBlock
        titleLg1={document.labelLg1 || document.labelLg2}
        titleLg2={document.labelLg2}
      />
      <Menu document={document} type={type} />
      <CheckSecondLang />
      <OperationsDocumentationVisualization
        id={id}
        attr={document}
        secondLang={secondLang}
        langOptions={langOptions}
        type={type}
      />
    </div>
  );
};
