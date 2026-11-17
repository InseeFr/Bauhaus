import { useLocation, useParams } from "react-router";

import { CheckSecondLang } from "@components/check-second-lang";
import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";

import { useCodelist } from "@utils/hooks/codelist";
import { useDocument } from "@utils/hooks/documents";
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

  const { data: document, error: loadError } = useDocument(id, type);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

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
