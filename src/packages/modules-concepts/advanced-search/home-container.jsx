import { useEffect, useState } from 'react';

import { Exporting, Loading } from '@components/loading';

import { ConceptsApi } from '@sdk/index';

import { saveFileFromHttpResponse } from '@utils/files';
import { useDisseminationStatus } from '@utils/hooks/disseminationStatus';
import { useStamps } from '@utils/hooks/stamps';

import ConceptSearchList from './home';

const emptyItem = {
	id: '',
	label: '',
	created: '',
	modified: '',
	disseminationStatus: '',
	validationStatus: '',
	definition: '',
	creator: '',
	isTopConceptOf: '',
	valid: '',
};

export const Component = () => {
	const [loading, setLoading] = useState(true);
	const [conceptSearchList, setConceptSearchList] = useState([]);
	const [exporting, setExporting] = useState(false);
	const { data: stampList = [] } = useStamps();

	useEffect(() => {
		ConceptsApi.getConceptSearchList()
			.then((concepts) => {
				setConceptSearchList(
					concepts.map((concept) => ({ ...emptyItem, ...concept })),
				);
			})
			.finally(() => setLoading(false));
	}, []);

	const exportHandler = (ids, type, withConcepts, lang = 'lg1') => {
		setExporting(true);
		const promise = ConceptsApi.getConceptExportZipType(
			ids,
			type,
			lang,
			withConcepts,
		);

		return promise
			.then(saveFileFromHttpResponse)
			.finally(() => setExporting(false));
	};

	if (loading) {
		return <Loading />;
	}

	if (exporting) {
		return <Exporting />;
	}

	return (
		<ConceptSearchList
			conceptSearchList={conceptSearchList}
			stampList={stampList}
			onExport={exportHandler}
		/>
	);
};
