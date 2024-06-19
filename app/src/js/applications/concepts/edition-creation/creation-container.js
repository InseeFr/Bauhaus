import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as select from 'js/reducers';
import buildPayloadCreation from 'js/utils/concepts/build-payload-creation-update/build-payload-creation';
import ConceptEditionCreation from './home';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import D from 'js/i18n';
import emptyConcept from 'js/utils/concepts/empty-concept';
import { Loading } from '@inseefr/wilco';
import { ArrayUtils, Stores } from 'js/utils';
import api from '../../../remote-api/concepts-api';
import globalApi from '../../../remote-api/api';

const CreationContainer = () => {
	const langs = useSelector((state) => select.getLangs(state));
	const maxLengthScopeNote = useSelector((state) =>
		Number(state.app.properties.maxLengthScopeNote)
	);

	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [concepts, setConcepts] = useState([]);
	const [stamps, setStamps] = useState([]);
	const [disseminationStatus, setDisseminationStatus] = useState([]);

	useEffect(() => {
		Promise.all([
			api.getConceptList(),
			globalApi.getStampList(),
			Stores.DisseminationStatus.api.getDisseminationStatus(),
		])
			.then(([conceptsList, stampsList, disseminationStatusList]) => {
				setConcepts(ArrayUtils.sortArrayByLabel(conceptsList));
				setStamps(stampsList);
				setDisseminationStatus(disseminationStatusList);
			})
			.finally(() => setLoading(false));
	}, []);

	const concept = useSelector((state) =>
		emptyConcept(state.app.properties.defaultContributor)
	);

	const handleCreation = useCallback(
		(data) => {
			setSaving(true);
			api
				.postConcept(buildPayloadCreation(data))
				.then((id) => history.push(`/concept/${id}`))
				.finally(() => setSaving(false));
		},
		[history]
	);

	if (loading) {
		return <Loading />;
	}
	if (saving) {
		return <Loading textType="saving" />;
	}

	const { general, notes, links } = concept;
	const conceptsWithLinks = mergeWithAllConcepts(concepts, links);
	return (
		<ConceptEditionCreation
			creation
			title={D.createConceptTitle}
			general={general}
			notes={notes}
			conceptsWithLinks={conceptsWithLinks}
			disseminationStatusList={disseminationStatus}
			maxLengthScopeNote={maxLengthScopeNote}
			stampList={stamps}
			save={handleCreation}
			langs={langs}
		/>
	);
};
export default CreationContainer;
