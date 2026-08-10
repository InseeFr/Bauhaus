import { memo, useCallback } from "react";

import { Document } from "../../../../../model/operations/document";
import { isDocument, isLink } from "../../../../pages/documents/utils";
import { DocumentsBloc } from "../../documents/documents-bloc";
import { reorderDocuments } from "../../documents/documents-bloc/reorder";

interface SimsDocumentFieldTypes {
  handleChange: any;
  msd: any;
  currentSection: any;
  lang?: string;
}
export const SimsDocumentField = ({
  handleChange,
  msd,
  currentSection,
  lang = "Lg1",
}: Readonly<SimsDocumentFieldTypes>) => {
  const handleDeleteDocument = useCallback(
    (uri: string) => {
      const objects = currentSection["documents" + lang] || [];
      handleChange({
        id: msd.idMas,
        override: {
          ["documents" + lang]: objects.filter((doc: any) => doc.uri !== uri),
        },
      });
    },
    [handleChange, currentSection, msd.idMas, lang],
  );

  const handleAddDocument = useCallback(
    (newObject: unknown) => {
      const objects = currentSection["documents" + lang] || [];

      handleChange({
        id: msd.idMas,
        override: {
          ["documents" + lang]: [...objects, newObject],
        },
      });
    },
    [handleChange, msd.idMas, currentSection, lang],
  );

  const handleReorder = useCallback(
    (belongsToSubset: (doc: Document) => boolean) => (activeUri: string, overUri: string) => {
      const objects: Document[] = currentSection["documents" + lang] || [];
      handleChange({
        id: msd.idMas,
        override: {
          ["documents" + lang]: reorderDocuments(objects, belongsToSubset, activeUri, overUri),
        },
      });
    },
    [handleChange, msd.idMas, currentSection, lang],
  );

  return (
    <>
      <div className="bauhaus-document-field">
        <DocumentsBloc
          documents={(currentSection["documents" + lang] || []).filter(isDocument)}
          localPrefix={lang}
          editMode={true}
          deleteHandler={handleDeleteDocument}
          addHandler={handleAddDocument}
          onReorder={handleReorder(isDocument)}
          objectType="documents"
          idMas={msd.idMas}
        />
      </div>
      <div className="bauhaus-document-field">
        <DocumentsBloc
          documents={(currentSection["documents" + lang] || []).filter(isLink)}
          localPrefix={lang}
          editMode={true}
          deleteHandler={handleDeleteDocument}
          addHandler={handleAddDocument}
          onReorder={handleReorder(isLink)}
          objectType="links"
          idMas={msd.idMas}
        />
      </div>
    </>
  );
};

export default memo(
  SimsDocumentField,
  (prevProps, nextProps) => prevProps.currentSection === nextProps.currentSection,
);
