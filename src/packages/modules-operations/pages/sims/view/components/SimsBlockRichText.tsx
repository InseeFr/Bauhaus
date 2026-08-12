import { Rubric } from "../../../../../model/Sims";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";
import { DocumentsBloc } from "../../create/components/DocumentsBloc";
import Editor from "@uiw/react-md-editor";

interface SimsBlockRichTextTypes {
  currentSection: Rubric;
  isSecondLang: boolean;
}
export const SimsBlockRichText = ({
  currentSection,
  isSecondLang,
}: Readonly<SimsBlockRichTextTypes>) => {
  const suffix: "Lg1" | "Lg2" = isSecondLang ? "Lg2" : "Lg1";
  const documents = currentSection[("documents" + suffix) as "documentsLg1" | "documentsLg2"];
  return (
    <>
      <Editor.Markdown source={currentSection[isSecondLang ? "labelLg2" : "labelLg1"]} />
      {documents && (
        <div className="sims-documents-block">
          <DocumentsBloc
            documents={documents.filter(isDocument)}
            localPrefix={suffix}
            objectType="documents"
          />
          <DocumentsBloc
            documents={documents.filter(isLink)}
            localPrefix={suffix}
            objectType="links"
          />
        </div>
      )}
    </>
  );
};
