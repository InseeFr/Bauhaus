import React, { useEffect } from 'react';

export const setDocumentTitle = (application, page) => {
	document.title = page + ' - ' + application + ' - Bauhaus';
}

export const useTitle = (application, page) => {
	useEffect(() => {
		setDocumentTitle(application, page)
	}, [application, page])
}

export const withTitle = (WrappedComponent, application, getPage = () => '') => props => {
	const title = getPage(props);
	useEffect(() => {
		setDocumentTitle(application, title)
	}, [title])
	return <WrappedComponent {...props} />
};
