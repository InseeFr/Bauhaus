import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import ConceptEditionCreation from './home';
import buildPayloadUpdate from 'js/utils/concepts/build-payload-creation-update/build-payload-update';
import { mergeWithAllConcepts } from 'js/utils/concepts/links';
import D from 'js/i18n';
import { Loading } from '@inseefr/wilco';
import { CLOSE_MATCH  } from 'js/constants';
import { ArrayUtils, HTMLUtils, Stores } from 'bauhaus-utilities';
import api from '../../../remote-api/concepts-api';
import globalApi from '../../../remote-api/api';
import { emptyNotes } from '../../../utils/concepts/notes';
import * as generalUtils from '../../../utils/concepts/general';

const formatNotes = notes => {
	return Object.assign(
		{},
		emptyNotes,
		Object.keys(notes).reduce((formatted, noteName) => {
			formatted[noteName] = HTMLUtils.rmesHtmlToRawHtml(
				notes[noteName]
			);
			return formatted;
		}, {})
	);
}
const EditionContainer = () => {
	const { id } = useParams();
	const history = useHistory();

	const langs = useSelector(state => select.getLangs(state));
	const maxLengthScopeNote = useSelector(state => Number(state.app.properties.maxLengthScopeNote));

	const [concept, setConcept] = useState({})
	const [concepts, setConcepts] = useState([])
	const [stamps, setStamps] = useState([])
	const [disseminationStatus, setDisseminationStatus] = useState([])

	const [loading, setLoading] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);


	useEffect(() => {
		api.getConceptGeneral(id).then(general => {
			const { conceptVersion } = general;
			return Promise.all([
				api.getNoteVersionList(id, conceptVersion),
				api.getConceptLinkList(id)
			]).then(([notes, links]) => {
				setConcept({
					general: Object.assign(generalUtils.empty(), general),
					notes: formatNotes(notes),
					links,
				})
			})
		})
		.finally(() => setLoading(false))
	}, [id]);

	useEffect(() => {
		Promise.all([
			api.getConceptList(),
			globalApi.getStampList(),
			Stores.DisseminationStatus.api.getDisseminationStatus()
		]).then(([conceptsList, stampsList, disseminationStatusList]) => {
			setConcepts(ArrayUtils.sortArrayByLabel(conceptsList))
			setStamps(stampsList);
			setDisseminationStatus(disseminationStatusList)
		}).finally(() => setLoadingExtraData(false))
	}, [])

	const handleUpdate = useCallback((id, versioning, oldData, data) => {
		setSaving(true);
		api.putConcept(id, buildPayloadUpdate(versioning, oldData, data))
			.then(() => history.push(`/concept/${id}`))
			.finally(() => setSaving(false))
	}, [history])

	if(loading || loadingExtraData){
		return <Loading />
	}
	if(saving){
		return <Loading textType="saving" />;
	}

	const { general, notes, links } = concept;
	const conceptsWithLinks = mergeWithAllConcepts(concepts, links);
	return (
		<ConceptEditionCreation
			id={id}
			title={D.updateConceptTitle}
			subtitle={general.prefLabelLg1}
			general={general}
			notes={notes}
			equivalentLinks={concept.links.filter(link => link.typeOfLink === CLOSE_MATCH)}
			conceptsWithLinks={conceptsWithLinks}
			disseminationStatusList={disseminationStatus}
			maxLengthScopeNote={maxLengthScopeNote}
			stampList={stamps}
			save={handleUpdate}
			langs={langs}
		/>
	);
}
export default EditionContainer;
