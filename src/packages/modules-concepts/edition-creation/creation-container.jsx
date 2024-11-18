import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../application/app-context';
import { Loading, Saving } from '@components/loading';
import D from '../../deprecated-locales';
import buildPayloadCreation from '../../modules-concepts/utils/build-payload-creation-update/build-payload-creation';
import emptyConcept from '../../modules-concepts/utils/empty-concept';
import { ConceptsApi } from '../../sdk';
import { sortArrayByLabel } from '../../utils/array-utils';
import { useTitle } from '../../utils/hooks/useTitle';
import { mergeWithAllConcepts } from '../utils/links';
import ConceptEditionCreation from './home';

export const Component = () => {
	const maxLengthScopeNoteString =
		useAppContext().properties.maxLengthScopeNote;
	const maxLengthScopeNote = Number(maxLengthScopeNoteString);

	const defaultContributor = useAppContext().properties.defaultContributor;

	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [submitting, setSubmitting] = useState(false);

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
				.then((id) => navigate(`/concepts/${id}`))
				.finally(() => setSaving(false));
		},
		[navigate],
	);

	const { general, notes, links } = concept;

	useTitle(D.conceptsTitle, general?.prefLabelLg1);

	const conceptsWithLinks = mergeWithAllConcepts(concepts, links);

	if (loading) {
		return <Loading />;
	}

	if (saving) {
		return <Saving />;
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
			submitting={submitting}
			setSubmitting={setSubmitting}
		/>
	);
};
