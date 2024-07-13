import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as select from '../../../reducers';
import buildPayloadCreation from '../../../utils/concepts/build-payload-creation-update/build-payload-creation';
import ConceptEditionCreation from './home';
import { mergeWithAllConcepts } from '../../../utils/concepts/links';
import D from '../../../i18n';
import emptyConcept from '../../../utils/concepts/empty-concept';
import { Loading } from '../../../new-architecture/components/loading/loading';
import { ArrayUtils } from '../../../utils';
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

	useEffect(() => {
		Promise.all([api.getConceptList(), globalApi.getStampList()])
			.then(([conceptsList, stampsList]) => {
				setConcepts(ArrayUtils.sortArrayByLabel(conceptsList));
				setStamps(stampsList);
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
			maxLengthScopeNote={maxLengthScopeNote}
			stampList={stamps}
			save={handleCreation}
			langs={langs}
		/>
	);
};
export default CreationContainer;
