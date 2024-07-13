import { useEffect, useState } from 'react';
import DocumentHome from './home';
import { ArrayUtils } from '../../../utils';
import api from '../../../remote-api/api';
import { Loading } from '../../../new-architecture/components';
const sortByLabel = ArrayUtils.sortArray('label');

const OperationsDocumentsContainer = () => {
	const [documents, setDocuments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.getDocumentsList()
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
					})
				);
				setDocuments(sortedDocuments);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;
	return <DocumentHome documents={documents} />;
};

export default OperationsDocumentsContainer;
