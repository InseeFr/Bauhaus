import { useEffect, useState } from 'react';

import { GeneralApi } from '@sdk/general-api';

import { sortArray } from '../../../../utils/array-utils';

export const useDocumentsList = () => {
	const [documentStores, setDocumentStores] = useState({
		lg1: [],
		lg2: [],
	});

	useEffect(() => {
		getDocumentsList().then((result: any) => setDocumentStores(result));
	}, []);

	return { documentStores, setDocumentStores };
};

export const getDocumentsList = () => {
	return GeneralApi.getDocumentsList().then((results: any) => {
		const unSortedDocuments = results.map((document: any) => {
			return {
				...document,
				id: document.uri.substr(document.uri.lastIndexOf('/') + 1),
			};
		});
		return {
			lg1: sortArray('labelLg1')(unSortedDocuments),
			lg2: sortArray('labelLg2')(unSortedDocuments),
		};
	});
};
