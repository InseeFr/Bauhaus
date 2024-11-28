import { renderMarkdownElement } from '@utils/html-utils';

import { isLink, isDocument } from '../../../document/utils';
import DocumentsBloc from '../../documents/documents-bloc';

const SimsBlockRichText = ({ currentSection, isSecondLang }) => {
	const suffix = isSecondLang ? 'Lg2' : 'Lg1';
	const documents = currentSection['documents' + suffix];
	return (
		<>
			{renderMarkdownElement(
				currentSection[isSecondLang ? 'labelLg2' : 'labelLg1'],
			)}
			{currentSection['documents' + suffix] && (
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

export default SimsBlockRichText;
