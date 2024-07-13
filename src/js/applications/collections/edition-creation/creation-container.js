import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as select from '../../../reducers';
import buildPayload from '../../../utils/collections/build-payload/build-payload';
import CollectionEditionCreation from './home';
import D from '../../../i18n';
import emptyCollection from '../../../utils/collections/empty-collection';
import { cleanId } from '@inseefr/wilco';
import { Loading } from '../../../new-architecture/components/loading/loading';

import api from '../../../remote-api/concepts-api';
import apiCollections from '../../../remote-api/concepts-collection-api';

const CreationContainer = () => {
	const history = useHistory();
	const langs = useSelector((state) => select.getLangs(state));
	const collection = useSelector((state) =>
		emptyCollection(state.app.properties.defaultContributor)
	);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	const [collectionList, setCollectionList] = useState([]);
	const [conceptList, setConceptList] = useState([]);

	useEffect(() => {
		Promise.all([api.getConceptList(), apiCollections.getCollectionList()])
			.then(([conceptsList, collectionsList]) => {
				setConceptList(conceptsList);
				setCollectionList(collectionsList);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleCreation = useCallback(
		(data) => {
			setSaving(true);
			api
				.postCollection(buildPayload(data, 'CREATE'))
				.then(() => {
					history.push(`/collection/${cleanId(data.general.id)}`);
				})
				.finally(() => setSaving(false));
		},
		[history]
	);

	if (saving) {
		return <Loading textType="saving" />;
	}
	if (loading) {
		return <Loading />;
	}

	const { general, members } = collection;
	return (
		<CollectionEditionCreation
			creation
			title={D.createCollectionTitle}
			general={general}
			members={members}
			collectionList={collectionList}
			conceptList={conceptList}
			save={handleCreation}
			langs={langs}
		/>
	);
};
export default CreationContainer;
