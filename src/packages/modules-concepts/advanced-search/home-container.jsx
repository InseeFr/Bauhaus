import { useEffect, useState } from 'react';

import { Exporting, Loading } from '@components/loading';
import ConceptSearchList from './home';
import { ConceptsApi } from '../../sdk';
import { saveFileFromHttpResponse } from '../../utils/files';
import { useStamps } from '../../utils/hooks/stamps';
import { useDisseminationStatus } from '../../utils/hooks/disseminationStatus';

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

	const { data: disseminationStatusList = [] } = useDisseminationStatus();

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
			disseminationStatusList={disseminationStatusList}
			onExport={exportHandler}
		/>
	);
};
