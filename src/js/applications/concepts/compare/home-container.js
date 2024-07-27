import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../new-architecture/components';
import ConceptCompare from './home';
import * as select from '../../../reducers';
import { ArrayUtils, HTMLUtils, Stores } from '../../../utils';
import { ConceptsApi } from '../../../new-architecture/sdk';
import { emptyNotes } from '../../../utils/concepts/notes';

const ConceptCompareContainer = () => {
	const { id } = useParams();
	const langs = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
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
					ArrayUtils.range(1, +conceptVersion + 1).map((version) =>
						ConceptsApi.getNoteVersionList(id, version).then((notes) => [
							version,
							notes,
						])
					)
				)
					.then((notesAndVersions) => {
						setNotes(
							notesAndVersions.reduce((acc, notes) => {
								return {
									...acc,
									[notes[0]]: Object.assign(
										{},
										emptyNotes,
										Object.keys(notes[1]).reduce((formatted, noteName) => {
											formatted[noteName] = HTMLUtils.rmesHtmlToRawHtml(
												notes[1][noteName]
											);
											return formatted;
										}, {})
									),
								};
							}, {})
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
			id={id}
			conceptGeneral={general}
			notes={notes}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};
export default ConceptCompareContainer;
