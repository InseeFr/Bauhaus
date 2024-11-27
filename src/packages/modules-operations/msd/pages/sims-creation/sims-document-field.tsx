import { memo, useCallback } from 'react';
import { isDocument, isLink } from '../../../document/utils';
import DocumentsBloc from '../../documents/documents-bloc';

type SimsDocumentFieldTypes = {
	handleChange: any;
	msd: any;
	currentSection: any;
	lang?: string;
};
export const SimsDocumentField = ({
	handleChange,
	msd,
	currentSection,
	lang = 'Lg1',
}: Readonly<SimsDocumentFieldTypes>) => {
	const handleDeleteDocument = useCallback(
		(uri: string) => {
			const objects = currentSection['documents' + lang] || [];
			handleChange({
				id: msd.idMas,
				override: {
					['documents' + lang]: objects.filter((doc: any) => doc.uri !== uri),
				},
			});
		},
		[handleChange, currentSection, msd.idMas, lang],
	);

	const handleAddDocument = useCallback(
		(newObject: unknown) => {
			const objects = currentSection['documents' + lang] || [];

			handleChange({
				id: msd.idMas,
				override: {
					['documents' + lang]: [...objects, newObject],
				},
			});
		},
		[handleChange, msd.idMas, currentSection, lang],
	);

	return (
		<>
			<div className="bauhaus-document-field">
				<DocumentsBloc
					documents={(currentSection['documents' + lang] || []).filter(
						isDocument,
					)}
					localPrefix={lang}
					editMode={true}
					deleteHandler={handleDeleteDocument}
					addHandler={handleAddDocument}
					objectType="documents"
					idMas={msd.idMas}
				/>
			</div>
			<div className="bauhaus-document-field">
				<DocumentsBloc
					documents={(currentSection['documents' + lang] || []).filter(isLink)}
					localPrefix={lang}
					editMode={true}
					deleteHandler={handleDeleteDocument}
					addHandler={handleAddDocument}
					objectType="links"
					idMas={msd.idMas}
				/>
			</div>
		</>
	);
};

export default memo(
	SimsDocumentField,
	(prevProps, nextProps) =>
		prevProps.currentSection === nextProps.currentSection,
);
