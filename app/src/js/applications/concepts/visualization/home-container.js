import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from 'js/reducers';
import check from 'js/utils/auth';
import { Loading } from '@inseefr/wilco';
import ConceptVisualization from './home';
import ConceptVisualizationStandBy from './stand-by';
import { ArrayUtils, Auth, HTMLUtils, Stores } from 'bauhaus-utilities';
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
	const [allNotes, setAllNotes] = useState({});
	const [error, setError] = useState();

	const fetchConcept = (id) => {
		api.getConceptGeneral(id).then(general => {
			const { conceptVersion } = general;
			const concept$ = Promise.all([
				api.getNoteVersionList(id, conceptVersion),
				api.getConceptLinkList(id)
			]).then(([notes, links]) => {
				setConcept({
					general,
					notes: formatNotes(notes),
					links,
				})
			})
			const notes$ = Promise.all(
				ArrayUtils.range(1, +conceptVersion + 1).map(version => {
					return api.getNoteVersionList(id, version).then((notes) => ([ version, formatNotes(notes) ]))
				})
			).then(versionsAndNotes => {
				setAllNotes(versionsAndNotes.reduce((acc, versionAndNotes) => {
					return {
						...acc,
						[versionAndNotes[0]]: versionAndNotes[1]
					}
				}, {}))
			})

			Promise.all([concept$, notes$]).finally(() => setLoading(false));
		})
	}
	useEffect(() => {
		fetchConcept(id)
	}, [id])

	const handleConceptValidation = useCallback((id) => {
		setPublishing(true);

		api.putConceptValidList([id])
			.then(() => fetchConcept(id))
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

	const { conceptVersion, isValidated, creator } = general;
	const { authType, roles, stamp } = permission;
	const authImpl = check(authType);
	const adminOrContributorOrConceptCreator = authImpl.isAdminOrContributorOrConceptCreator(
		roles,
		stamp,
		creator
	);
	if (
		!adminOrContributorOrConceptCreator &&
		isValidated === 'false' &&
		conceptVersion === '1'
	)
		return <ConceptVisualizationStandBy general={general} />;

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
