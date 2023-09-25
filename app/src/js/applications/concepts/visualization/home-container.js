import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import { Loading } from '@inseefr/wilco';
import ConceptVisualization from './home';
import { Auth, HTMLUtils, Stores } from 'bauhaus-utilities';
import api from '../../../remote-api/concepts-api';
import { emptyNotes } from '../../../utils/concepts/notes';
import { LoadingProvider } from './loading';

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

	const [loading, setLoading] = useState('loading');
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
		}).finally(() => setLoading());
	}
	useEffect(() => {
		fetchConcept(id)
	}, [id])

	const handleConceptValidation = useCallback((id) => {
		setLoading('validating');

		api.putConceptValidList([id])
			.then(() => fetchConcept(id))
			.catch(e => setError(e))
			.finally(() => {
				setLoading();
			})
	}, []);

	const handleConceptDeletion = useCallback(() => {
		setLoading('deleting')
		api.deleteConcept(id)
			.then(() => history.push(`/concepts`))
			.catch(e => setError(e))
			.finally(() => setLoading())
	}, [history, id]);

	if(loading){
		return <Loading textType={loading}/>
	}

	const { general, links } = concept;
	let { notes } = concept;

	return (
		<LoadingProvider value={{ loading, setLoading }}>
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
		</LoadingProvider>
	);

}
export default ConceptVisualizationContainer;
