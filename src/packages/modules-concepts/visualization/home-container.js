import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Loading } from '../../components';
import ConceptVisualization from './home';
import { LoadingProvider } from './loading';
import { ConceptsApi } from '../../sdk';
import { rmesHtmlToRawHtml } from '../../utils/html-utils';
import { getLocales } from '../../redux/selectors';
import { emptyNotes } from '../utils/notes';
import { usePermission } from '../../redux/hooks/usePermission';
import { useSecondLang } from '../../utils/hooks/second-lang';

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
const ConceptVisualizationContainer = () => {
	const { id } = useParams();
	const history = useHistory();

	const langs = useSelector((state) => getLocales(state));
	const permission = usePermission();
	const [secondLang] = useSecondLang();

	const [loading, setLoading] = useState('loading');
	const [concept, setConcept] = useState({});
	const [error, setError] = useState();

	const fetchConcept = (id) => {
		return ConceptsApi.getConceptGeneral(id)
			.then((general) => {
				const { conceptVersion } = general;
				return Promise.all([
					ConceptsApi.getNoteVersionList(id, conceptVersion),
					ConceptsApi.getConceptLinkList(id),
				]).then(([notes, links]) => {
					setConcept({
						general,
						notes: formatNotes(notes),
						links,
					});
				});
			})
			.finally(() => setLoading());
	};
	useEffect(() => {
		fetchConcept(id);
	}, [id]);

	const handleConceptValidation = useCallback((id) => {
		setLoading('validating');

		ConceptsApi.putConceptValidList([id])
			.then(() => fetchConcept(id))
			.catch((e) => setError(e))
			.finally(() => {
				setLoading();
			});
	}, []);

	const handleConceptDeletion = useCallback(() => {
		setLoading('deleting');
		ConceptsApi.deleteConcept(id)
			.then(() => history.push(`/concepts`))
			.catch((e) => setError(e))
			.finally(() => setLoading());
	}, [history, id]);

	if (loading) {
		return <Loading textType={loading} />;
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
};
export default ConceptVisualizationContainer;
