import { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import ConceptSearchList from './home';
import { ArrayUtils, Stores } from 'js/utils';
import api from '../../../remote-api/concepts-api';
import apiGlobal from '../../../remote-api/api';
import { saveFileFromHttpResponse } from '../../../new-architecture/utils/files';

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

const ConceptSearchListContainer = () => {
	const [loading, setLoading] = useState(true);
	const [conceptSearchList, setConceptSearchList] = useState([]);
	const [stampList, setStampList] = useState([]);
	const [disseminationStatusList, setDisseminationStatusList] = useState([]);
	const [exporting, setExporting] = useState(false);

	useEffect(() => {
		Promise.all([
			api.getConceptSearchList(),
			apiGlobal.getStampList(),
			Stores.DisseminationStatus.api.getDisseminationStatus(),
		])
			.then(([concepts, stamps, disseminations]) => {
				setConceptSearchList(
					ArrayUtils.sortArrayByLabel(concepts).map((concept) =>
						Object.assign({}, emptyItem, concept)
					)
				);
				setStampList(stamps);
				setDisseminationStatusList(disseminations);
			})
			.finally(() => setLoading(false));
	}, []);

	const exportHandler = (ids, type, withConcepts, lang = 'lg1') => {
		setExporting(true);
		const promise = api.getConceptExportZipType(ids, type, lang, withConcepts);

		return promise
			.then(saveFileFromHttpResponse)
			.finally(() => setExporting(false));
	};

	if (loading) {
		return <Loading />;
	}

	if (exporting) {
		return <Loading textType="exporting" />;
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

export default ConceptSearchListContainer;
