import { Document } from '../../../../model/operations/document';
import { getLang } from '../../../../utils/dictionnary';
import { isDocument } from '../../../document/utils';

export const DocumentAsideInformation = ({
	document,
}: Readonly<{ document: Document }>) => {
	let updatedDate;
	if (document.updatedDate) {
		updatedDate = new Intl.DateTimeFormat(getLang()).format(
			new Date(document.updatedDate),
		);
	}
	return (
		<i>({[document.lang, updatedDate].filter((val) => !!val).join('-')})</i>
	);
};

export const DocumentLink = ({
	document,
	localPrefix,
	baseURI,
}: Readonly<{
	document: Document;
	localPrefix: 'Lg1' | 'Lg2';
	baseURI: string;
}>) => {
	const id = document.uri.substr(document.uri.lastIndexOf('/') + 1);
	const uri = isDocument(document)
		? `${baseURI}/documents/document/${id}/file`
		: document.url;

	const label =
		document[`label${localPrefix}`] || document.labelLg1 || document.labelLg2;
	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			href={uri}
			title={document[`description${localPrefix}`]}
		>
			{label}
		</a>
	);
};
