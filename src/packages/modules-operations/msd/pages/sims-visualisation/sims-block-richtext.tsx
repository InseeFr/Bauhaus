import { renderMarkdownElement } from '@utils/html-utils';

import { Rubric } from '../../../../model/Sims';
import { isLink, isDocument } from '../../../document/utils';
import DocumentsBloc from '../../documents/documents-bloc';

interface SimsBlockRichTextTypes {
	currentSection: Rubric;
	isSecondLang: boolean;
}
const SimsBlockRichText = ({
	currentSection,
	isSecondLang,
}: Readonly<SimsBlockRichTextTypes>) => {
	const suffix: 'Lg1' | 'Lg2' = isSecondLang ? 'Lg2' : 'Lg1';
	const documents =
		currentSection[('documents' + suffix) as 'documentsLg1' | 'documentsLg2'];
	return (
		<>
			{renderMarkdownElement(
				currentSection[isSecondLang ? 'labelLg2' : 'labelLg1'],
			)}
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

export default SimsBlockRichText;
