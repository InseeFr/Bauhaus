import { useEffect } from 'react';

export const setDocumentTitle = (application?: string, page?: string) => {
	if (!application && !page) {
		document.title = 'Bauhaus';
		return;
	}
	document.title = page + ' - ' + application + ' - Bauhaus';
};

export const useTitle = (application?: string, page?: string) => {
	useEffect(() => {
		setDocumentTitle(application, page);
	}, [application, page]);
};
