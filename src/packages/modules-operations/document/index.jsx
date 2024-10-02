import { useEffect, useState } from 'react';
import DocumentHome from './home';
import { Loading } from '../../components';
import { GeneralApi } from '../../sdk/general-api';
import { sortArray } from '../../utils/array-utils';

const sortByLabel = sortArray('label');

export const Component = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		GeneralApi.getDocumentsList()
			.then((results) => {
				const sortedDocuments = sortByLabel(
					results.map((document) => {
						return {
							label: (document.labelLg1 || document.labelLg2).trim(),
							uri: document.uri,
							lang: document.lang,
							updatedDate: document.updatedDate,
							id: document.uri.substr(document.uri.lastIndexOf('/') + 1),
						};
					}),
				);
				setDocuments(sortedDocuments);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;
	return <DocumentHome documents={documents} />;
};
