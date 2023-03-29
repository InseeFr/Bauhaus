import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { Loading } from '@inseefr/wilco';
import ConceptVisualization from './home';
import { Auth, HTMLUtils, Stores } from 'bauhaus-utilities';
import api from '../../../remote-api/concepts-api';
import { emptyNotes } from '../../../utils/concepts/notes';

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
const ConceptVisualizationContainer = () => {
	const { id } = useParams();
	const history = useHistory();

	const langs = useSelector(state => select.getLangs(state));
	const permission = useSelector(state => Auth.getPermission(state));
	const secondLang = useSelector(state => Stores.SecondLang.getSecondLang(state));

	const [loading, setLoading] = useState(true);
	const [publishing, setPublishing] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const [concept, setConcept] = useState({});
	const [error, setError] = useState();

	const fetchConcept = (id) => {
		return api.getConceptGeneral(id).then(general => {
			const { conceptVersion } = general;
			return Promise.all([
				api.getNoteVersionList(id, conceptVersion),
				api.getConceptLinkList(id)
			]).then(([notes, links]) => {
				setConcept({
					general,
					notes: formatNotes(notes),
					links,
				})
			})
		}).finally(() => setLoading(false));
	}
	useEffect(() => {
		fetchConcept(id)
	}, [id])

	const handleConceptValidation = useCallback((id) => {
		setPublishing(true);

		api.putConceptValidList([id])
			.then(() => fetchConcept(id))
			.catch(e => setError(e))
			.finally(() => {
				setPublishing(false);
			})
	}, []);

	const handleConceptDeletion = useCallback(() => {
		setDeleting(true)
		api.deleteConcept(id)
			.then(() => history.push(`/concepts`))
			.catch(e => setError(e))
			.finally(() => setDeleting(false))
	}, [history, id]);

	if(deleting){
		return <Loading text="deleting" />;
	}
	if(publishing){
		return <Loading textType="validating" />;
	}
	if(loading){
		return <Loading />
	}

	const { general, links } = concept;
	let { notes } = concept;

	return (
		<ConceptVisualization
			id={id}
			permission={permission}
			general={general}
			notes={notes}
			links={links}
			validateConcept={handleConceptValidation}
			deleteConcept={handleConceptDeletion}
			secondLang={secondLang}
			langs={langs}
			serverSideError={error}
		/>
	);

}
export default ConceptVisualizationContainer;
