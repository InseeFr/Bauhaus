export const BOTH = 'BOTH';
export const DOCUMENT = 'document';
export const LINK = 'link';

export function isLink(document) {
	return document?.uri?.includes('/page/');
}

export function isDocument(document) {
	return document?.uri?.includes('/document/');
}
