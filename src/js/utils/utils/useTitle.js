import { useEffect } from 'react';

export const setDocumentTitle = (application, page) => {
	if (!application && !page) {
		document.title = 'Bauhaus';
		return;
	}
	document.title = page + ' - ' + application + ' - Bauhaus';
};

export const useTitle = (application, page) => {
	useEffect(() => {
		setDocumentTitle(application, page);
	}, [application, page]);
};
