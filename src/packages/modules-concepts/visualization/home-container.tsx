import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loading } from '@components/loading';

import { ConceptsApi } from '@sdk/index';

import { useSecondLang } from '@utils/hooks/second-lang';
import { useLocales } from '@utils/hooks/useLocales';

import {
	Concept,
	ConceptGeneral,
	ConceptNotes,
} from '../../model/concepts/concept';
import { usePermission } from '../../redux/hooks/usePermission';
import { emptyNotes } from '../utils/notes';
import ConceptVisualization from './home';
import { LoadingProvider, LoadingType } from './loading';

const formatNotes = (notes: ConceptNotes) => {
	return {
		...emptyNotes,
		...notes,
	};
};
export const Component = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const langs = useLocales();
	const permission = usePermission();
	const [secondLang] = useSecondLang();

	const [loading, setLoading] = useState<LoadingType>('loading');
	const [concept, setConcept] = useState<Concept>();
	const [error, setError] = useState<string | undefined>();

	const fetchConcept = (id: string) => {
		return ConceptsApi.getConceptGeneral(id)
			.then((general: ConceptGeneral) => {
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
			.finally(() => setLoading(undefined));
	};
	useEffect(() => {
		fetchConcept(id!);
	}, [id]);

	const handleConceptValidation = useCallback((id: string) => {
		setLoading('validating');

		ConceptsApi.putConceptValidList([id])
			.then(() => fetchConcept(id))
			.catch((e: string) => setError(e))
			.finally(() => {
				setLoading(undefined);
			});
	}, []);

	const handleConceptDeletion = useCallback(() => {
		setLoading('deleting');
		ConceptsApi.deleteConcept(id)
			.then(() => navigate(`/concepts`))
			.catch((e: string) => setError(e))
			.finally(() => setLoading(undefined));
	}, [navigate, id]);

	if (loading) {
		return <Loading />;
	}

	const { general, links, notes } = concept!;

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
