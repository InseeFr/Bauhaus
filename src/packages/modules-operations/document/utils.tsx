import { Document, HomeDocument } from '../../model/operations/document';

export const BOTH = 'BOTH';
export const DOCUMENT = 'document';
export const LINK = 'link';

export function isLink(document: Document | HomeDocument) {
	return document?.uri?.includes('/page/');
}

export function isDocument(document: Document | HomeDocument) {
	return document?.uri?.includes('/document/');
}
