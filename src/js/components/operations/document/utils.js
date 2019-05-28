export const BOTH = 'BOTH';
export const DOCUMENT = 'DOCUMENT';
export const LINK = 'LINK';

export function isLink(document) {
	return document.uri.includes('/page/');
}

export function isDocument(document) {
	return document.uri.includes('/document/');
}
