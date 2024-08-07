import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as select from '../../../reducers';
import buildPayload from '../../../utils/collections/build-payload/build-payload';
import CollectionEditionCreation from './home';
import D from '../../../i18n';
import emptyCollection from '../../../utils/collections/empty-collection';
import { cleanId } from '@inseefr/wilco';
import { Loading } from '../../../new-architecture/components';

import { ConceptsApi } from '../../../new-architecture/sdk';
import { useTitle } from '../../../utils';
import { CollectionApi } from '../../../new-architecture/sdk/collection-api';

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
		Promise.all([
			ConceptsApi.getConceptList(),
			CollectionApi.getCollectionList(),
		])
			.then(([conceptsList, collectionsList]) => {
				setConceptList(conceptsList);
				setCollectionList(collectionsList);
			})
			.finally(() => setLoading(false));
	}, []);

	const handleCreation = useCallback(
		(data) => {
			setSaving(true);
			ConceptsApi.postCollection(buildPayload(data, 'CREATE'))
				.then(() => {
					history.push(`/collection/${cleanId(data.general.id)}`);
				})
				.finally(() => setSaving(false));
		},
		[history]
	);

	const { general, members } = collection;
	useTitle(
		D.collectionsTitle,
		general?.prefLabelLg1 || D.createCollectionTitle
	);

	if (saving) {
		return <Loading textType="saving" />;
	}
	if (loading) {
		return <Loading />;
	}

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
