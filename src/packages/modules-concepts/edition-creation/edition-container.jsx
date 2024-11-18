import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../application/app-context';
import { Loading, Saving } from '@components/loading';
import D from '../../deprecated-locales';
import buildPayloadUpdate from '../../modules-concepts/utils/build-payload-creation-update/build-payload-update';
import * as generalUtils from '../../modules-concepts/utils/general';
import { ConceptsApi } from '../../sdk';
import { CLOSE_MATCH } from '@sdk/constants';
import { useTitle } from '../../utils/hooks/useTitle';
import { rmesHtmlToRawHtml } from '../../utils/html-utils';
import { mergeWithAllConcepts } from '../utils/links';
import { emptyNotes } from '../utils/notes';
import ConceptEditionCreation from './home';

const formatNotes = (notes) => {
	return {
		...emptyNotes,
		...Object.keys(notes).reduce((formatted, noteName) => {
			formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]);
			return formatted;
		}, {}),
	};
};

export const Component = () => {
	const { id } = useParams();

	const navigate = useNavigate();

	const maxLengthScopeNoteString =
		useAppContext().properties.maxLengthScopeNote;

	const maxLengthScopeNote = Number(maxLengthScopeNoteString);

	const [concept, setConcept] = useState({});
	const [concepts, setConcepts] = useState([]);

	const [loading, setLoading] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		ConceptsApi.getConceptGeneral(id)
			.then((general) => {
				const { conceptVersion } = general;
				return Promise.all([
					ConceptsApi.getNoteVersionList(id, conceptVersion),
					ConceptsApi.getConceptLinkList(id),
				]).then(([notes, links]) => {
					setConcept({
						general: {
							...generalUtils.empty(),
							...general,
						},
						notes: formatNotes(notes),
						links,
					});
				});
			})
			.finally(() => setLoading(false));
	}, [id]);

	useEffect(() => {
		ConceptsApi.getConceptList()
			.then(setConcepts)
			.finally(() => setLoadingExtraData(false));
	}, []);

	const handleUpdate = useCallback(
		(id, versioning, oldData, data) => {
			setSaving(true);
			ConceptsApi.putConcept(id, buildPayloadUpdate(versioning, oldData, data))
				.then(() => navigate(`/concepts/${id}`))
				.finally(() => setSaving(false));
		},
		[navigate],
	);

	const { general, notes, links } = concept;

	useTitle(D.conceptsTitle, general?.prefLabelLg1);

	const conceptsWithLinks = mergeWithAllConcepts(concepts, links ?? []);

	if (loading || loadingExtraData) {
		return <Loading />;
	}

	if (saving) {
		return <Saving />;
	}

	return (
		<ConceptEditionCreation
			id={id}
			title={D.updateConceptTitle}
			subtitle={general.prefLabelLg1}
			general={general}
			notes={notes}
			equivalentLinks={concept.links.filter(
				(link) => link.typeOfLink === CLOSE_MATCH,
			)}
			conceptsWithLinks={conceptsWithLinks}
			maxLengthScopeNote={maxLengthScopeNote}
			save={handleUpdate}
			submitting={submitting}
			setSubmitting={setSubmitting}
		/>
	);
};
