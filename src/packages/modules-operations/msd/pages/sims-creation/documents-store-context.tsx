import { createContext, useContext } from 'react';
import { Document } from '../../../../model/operations/document';

export type DocumentsStoreContextType = {
	lg1: Document[];
	lg2: Document[];
};
const DocumentsStoreContext = createContext<
	DocumentsStoreContextType | undefined
>(undefined);

export const DocumentsStoreProvider = DocumentsStoreContext.Provider;

export const useDocumentsStoreContext = (): DocumentsStoreContextType => {
	const context = useContext(DocumentsStoreContext);
	if (!context) {
		throw new Error('The context DocumentsStoreContext is not available.');
	}
	return context;
};
