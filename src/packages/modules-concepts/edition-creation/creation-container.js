import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ConceptEditionCreation from './home';
import D from '../../deprecated-locales';
import { Loading } from '../../components';
import { ConceptsApi } from '../../sdk';
import { useStamps } from '../../utils/hooks/stamps';
import { useTitle } from '../../utils/hooks/useTitle';
import buildPayloadCreation from '../../modules-concepts/utils/build-payload-creation-update/build-payload-creation';
import emptyConcept from '../../modules-concepts/utils/empty-concept';
import { mergeWithAllConcepts } from '../utils/links';
import { sortArrayByLabel } from '../../utils/array-utils';
import { useLocales } from '../../utils/hooks/useLocales';

const CreationContainer = () => {
	const langs = useLocales();
	const maxLengthScopeNote = useSelector((state) =>
		Number(state.app.properties.maxLengthScopeNote)
	);

	const history = useHistory();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [concepts, setConcepts] = useState([]);

	const { data: stamps = [] } = useStamps();

	useEffect(() => {
		Promise.all([ConceptsApi.getConceptList()])
			.then(([conceptsList, stampsList]) => {
				setConcepts(sortArrayByLabel(conceptsList));
			})
			.finally(() => setLoading(false));
	}, []);

	const concept = useSelector((state) =>
		emptyConcept(state.app.properties.defaultContributor)
	);

	const handleCreation = useCallback(
		(data) => {
			setSaving(true);
			ConceptsApi.postConcept(buildPayloadCreation(data))
				.then((id) => history.push(`/concept/${id}`))
				.finally(() => setSaving(false));
		},
		[history]
	);

	const { general, notes, links } = concept;
	useTitle(D.conceptsTitle, general?.prefLabelLg1 || D.createConceptTitle);

	const conceptsWithLinks = mergeWithAllConcepts(concepts, links);

	if (loading) {
		return <Loading />;
	}
	if (saving) {
		return <Loading textType="saving" />;
	}

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
