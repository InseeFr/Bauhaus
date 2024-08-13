import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import ConceptEditionCreation from './home';
import D from '../../../i18n';
import { Loading } from '../../../new-architecture/components';
import { CLOSE_MATCH } from '../../../new-architecture/sdk/constants';
import { rmesHtmlToRawHtml } from '../../../new-architecture/utils/html-utils';
import { ConceptsApi } from '../../../new-architecture/sdk';
import * as generalUtils from '../../../new-architecture/modules-concepts/utils/general';
import { useStamps } from '../../../new-architecture/utils/hooks/stamps';
import { getLocales } from '../../../new-architecture/redux/selectors';
import { useTitle } from '../../../new-architecture/utils/hooks/useTitle';
import buildPayloadUpdate from '../../../new-architecture/modules-concepts/utils/build-payload-creation-update/build-payload-update';
import { mergeWithAllConcepts } from '../../../new-architecture/modules-concepts/utils/links';
import { emptyNotes } from '../../../new-architecture/modules-concepts/utils/notes';

const formatNotes = (notes) => {
	return Object.assign(
		{},
		emptyNotes,
		Object.keys(notes).reduce((formatted, noteName) => {
			formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]);
			return formatted;
		}, {})
	);
};
const EditionContainer = () => {
	const { id } = useParams();
	const history = useHistory();

	const langs = useSelector((state) => getLocales(state));
	const maxLengthScopeNote = useSelector((state) =>
		Number(state.app.properties.maxLengthScopeNote)
	);

	const [concept, setConcept] = useState({});
	const [concepts, setConcepts] = useState([]);

	const [loading, setLoading] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);

	const { data: stamps = [] } = useStamps();

	useEffect(() => {
		ConceptsApi.getConceptGeneral(id)
			.then((general) => {
				const { conceptVersion } = general;
				return Promise.all([
					ConceptsApi.getNoteVersionList(id, conceptVersion),
					ConceptsApi.getConceptLinkList(id),
				]).then(([notes, links]) => {
					setConcept({
						general: Object.assign(generalUtils.empty(), general),
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
				.then(() => history.push(`/concept/${id}`))
				.finally(() => setSaving(false));
		},
		[history]
	);

	const { general, notes, links } = concept;
	useTitle(D.conceptsTitle, general?.prefLabelLg1 || D.createConceptTitle);

	const conceptsWithLinks = mergeWithAllConcepts(concepts, links ?? []);

	if (loading || loadingExtraData) {
		return <Loading />;
	}
	if (saving) {
		return <Loading textType="saving" />;
	}

	return (
		<ConceptEditionCreation
			id={id}
			title={D.updateConceptTitle}
			subtitle={general.prefLabelLg1}
			general={general}
			notes={notes}
			equivalentLinks={concept.links.filter(
				(link) => link.typeOfLink === CLOSE_MATCH
			)}
			conceptsWithLinks={conceptsWithLinks}
			maxLengthScopeNote={maxLengthScopeNote}
			stampList={stamps}
			save={handleUpdate}
			langs={langs}
		/>
	);
};
export default EditionContainer;
