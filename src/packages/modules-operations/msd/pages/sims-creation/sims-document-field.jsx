import { memo, useCallback } from 'react';
import { isLink, isDocument } from '../../../document/utils';
import DocumentsBloc from '../../documents/documents-bloc';

export const SimsDocumentField = ({
	documentStores,
	handleChange,
	msd,
	currentSection,
	lang = 'Lg1',
}) => {
	const handleDeleteDocument = useCallback(
		(uri) => {
			const objects = currentSection['documents' + lang] || [];
			handleChange({
				id: msd.idMas,
				override: {
					['documents' + lang]: objects.filter((doc) => doc.uri !== uri),
				},
			});
		},
		[handleChange, currentSection, msd.idMas, lang]
	);

	const handleAddDocument = useCallback(
		(newObject) => {
			const objects = currentSection['documents' + lang] || [];

			handleChange({
				id: msd.idMas,
				override: {
					['documents' + lang]: [...objects, newObject],
				},
			});
		},
		[handleChange, msd.idMas, currentSection, lang]
	);
	return (
		<>
			{' '}
			<div className="bauhaus-document-field">
				<DocumentsBloc
					documents={(currentSection['documents' + lang] || []).filter(
						isDocument
					)}
					localPrefix={lang}
					editMode={true}
					deleteHandler={handleDeleteDocument}
					addHandler={handleAddDocument}
					objectType="documents"
					documentStores={documentStores}
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
					documentStores={documentStores}
				/>
			</div>
		</>
	);
};

export default memo(
	SimsDocumentField,
	(prevProps, nextProps) =>
		prevProps.documentStores.length === nextProps.documentStores.length &&
		prevProps.currentSection === nextProps.currentSection
);
