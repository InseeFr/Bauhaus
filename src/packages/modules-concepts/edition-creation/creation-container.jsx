import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ConceptEditionCreation from './home';
import D from '../../deprecated-locales';
import { Loading } from '../../components';
import { ConceptsApi } from '../../sdk';
import { useTitle } from '../../utils/hooks/useTitle';
import buildPayloadCreation from '../../modules-concepts/utils/build-payload-creation-update/build-payload-creation';
import emptyConcept from '../../modules-concepts/utils/empty-concept';
import { mergeWithAllConcepts } from '../utils/links';
import { sortArrayByLabel } from '../../utils/array-utils';
import { useAppContext } from '../../application/app-context';

const CreationContainer = () => {
	const maxLengthScopeNoteString =
		useAppContext().properties.maxLengthScopeNote;
	const maxLengthScopeNote = Number(maxLengthScopeNoteString);

	const defaultContributor = useAppContext().properties.defaultContributor;

	const history = useHistory();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [concepts, setConcepts] = useState([]);

	useEffect(() => {
		Promise.all([ConceptsApi.getConceptList()])
			.then(([conceptsList]) => {
				setConcepts(sortArrayByLabel(conceptsList));
			})
			.finally(() => setLoading(false));
	}, []);

	const concept = emptyConcept(defaultContributor);

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
			save={handleCreation}
		/>
	);
};

export default CreationContainer;
