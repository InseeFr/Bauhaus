import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loading } from '../../components';
import { usePermission } from '../../redux/hooks/usePermission';
import { ConceptsApi } from '../../sdk';
import { useSecondLang } from '../../utils/hooks/second-lang';
import { useLocales } from '../../utils/hooks/useLocales';
import { rmesHtmlToRawHtml } from '../../utils/html-utils';
import { emptyNotes } from '../utils/notes';
import ConceptVisualization from './home';
import { LoadingProvider } from './loading';

const formatNotes = (notes) => {
	return Object.assign(
		{},
		emptyNotes,
		Object.keys(notes).reduce((formatted, noteName) => {
			formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]);
			return formatted;
		}, {}),
	);
};
export const Component = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const langs = useLocales();
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
			.then(() => navigate(`/concepts`))
			.catch((e) => setError(e))
			.finally(() => setLoading());
	}, [navigate, id]);

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
