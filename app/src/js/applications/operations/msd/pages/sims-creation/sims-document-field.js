import React, { useCallback } from 'react';
import { isLink, isDocument } from 'js/applications/operations/document/utils';
import DocumentsBloc from '../../documents/documents-bloc';
import PropTypes from 'prop-types';

export const SimsDocumentField = ({ handleChange, msd, currentSection }) => {
	const handleDeleteDocument = useCallback(
		uri => {
			const objects = currentSection.documents || [];
			handleChange({
				id: msd.idMas,
				override: {
					documents: objects.filter(doc => doc.uri !== uri),
				},
			});
		},
		[handleChange, currentSection.documents, msd.idMas]
	);

	const handleAddDocument = useCallback(
		newObject => {
			const objects = currentSection.documents || [];
			handleChange({
				id: msd.idMas,
				override: {
					documents: [...objects, newObject],
				},
			});
		},
		[handleChange, msd.idMas, currentSection.documents]
	);

	return (
		<div className="bauhaus-document-field">
			<DocumentsBloc
				documents={(currentSection.documents || []).filter(isDocument)}
				localPrefix={'Lg1'}
				editMode={true}
				deleteHandler={handleDeleteDocument}
				addHandler={handleAddDocument}
				objectType="documents"
			/>
			<DocumentsBloc
				documents={(currentSection.documents || []).filter(isLink)}
				localPrefix={'Lg1'}
				editMode={true}
				deleteHandler={handleDeleteDocument}
				addHandler={handleAddDocument}
				objectType="links"
			/>
		</div>
	);
};

SimsDocumentField.propTypes = {
	msd: PropTypes.object.isRequired,
	currentSection: PropTypes.object,
	handleChange: PropTypes.func,
};

export default SimsDocumentField;
