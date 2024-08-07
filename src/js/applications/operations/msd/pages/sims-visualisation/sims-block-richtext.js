import { renderMarkdownElement } from '../../../../../new-architecture/utils/html-utils';
import DocumentsBloc from '../../../../../applications/operations/msd/documents/documents-bloc/index.js';
import {
	isLink,
	isDocument,
} from '../../../../../applications/operations/document/utils';

const SimsBlockRichText = ({ currentSection, isSecondLang }) => {
	const suffix = isSecondLang ? 'Lg2' : 'Lg1';
	const documents = currentSection['documents' + suffix];
	return (
		<>
			{renderMarkdownElement(
				currentSection[isSecondLang ? 'labelLg2' : 'labelLg1']
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
