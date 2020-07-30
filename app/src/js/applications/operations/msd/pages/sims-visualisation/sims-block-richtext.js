import React from 'react';
import { HTMLUtils } from 'bauhaus-utilities';
import DocumentsBloc from 'js/applications/operations/msd/documents/documents-bloc/index.js';
import { isLink, isDocument } from 'js/applications/operations/document/utils';

const SimsBlockRichText = ({ currentSection, isSecondLang }) => {
	return (
		<>
			{HTMLUtils.renderMarkdownElement(
				currentSection[isSecondLang ? 'labelLg2' : 'labelLg1']
			)}

			{currentSection.documents && (
				<>
					<DocumentsBloc
						documents={currentSection.documents.filter(isDocument)}
						localPrefix={isSecondLang ? 'Lg2' : 'Lg1'}
						objectType="documents"
					/>
					<DocumentsBloc
						documents={currentSection.documents.filter(isLink)}
						localPrefix={isSecondLang ? 'Lg2' : 'Lg1'}
						objectType="links"
					/>
				</>
			)}
		</>
	);
};

export default SimsBlockRichText;
