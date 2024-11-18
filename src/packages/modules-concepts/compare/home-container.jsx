import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '@components/loading';
import { ConceptsApi } from '../../sdk';
import { range } from '../../utils/array-utils';
import { useSecondLang } from '../../utils/hooks/second-lang';
import { rmesHtmlToRawHtml } from '../../utils/html-utils';
import { emptyNotes } from '../utils/notes';
import ConceptCompare from './home';

export const Component = () => {
	const { id } = useParams();
	const [secondLang] = useSecondLang();
	const [loading, setLoading] = useState(true);

	const [general, setGeneral] = useState({});
	const [notes, setNotes] = useState({});

	useEffect(() => {
		ConceptsApi.getConceptGeneral(id)
			.then((results) => {
				setGeneral(results);
				return results;
			})
			.then((general) => {
				const { conceptVersion } = general;
				return Promise.all(
					range(1, +conceptVersion + 1).map((version) =>
						ConceptsApi.getNoteVersionList(id, version).then((notes) => [
							version,
							notes,
						]),
					),
				)
					.then((notesAndVersions) => {
						setNotes(
							notesAndVersions.reduce((acc, notes) => {
								return {
									...acc,
									[notes[0]]: {
										...emptyNotes,
										...Object.keys(notes[1]).reduce((formatted, noteName) => {
											formatted[noteName] = rmesHtmlToRawHtml(
												notes[1][noteName],
											);
											return formatted;
										}, {}),
									},
								};
							}, {}),
						);
					})
					.finally(() => setLoading(false));
			});
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	return (
		<ConceptCompare
			conceptGeneral={general}
			notes={notes}
			secondLang={secondLang}
		/>
	);
};
