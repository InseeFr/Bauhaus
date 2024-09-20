import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import buildPayload from '../../../modules-concepts/collections/utils/build-payload/build-payload';
import CollectionEditionCreation from './home';
import D from '../../../deprecated-locales';
import emptyCollection from '../../../modules-concepts/collections/utils/empty-collection';
import { Loading } from '../../../components';

import { ConceptsApi } from '../../../sdk';
import { CollectionApi } from '../../../sdk/collection-api';
import { useTitle } from '../../../utils/hooks/useTitle';
import { useAppContext } from '../../../application/app-context';
import { cleanId } from '../../../utils/string-utils';

const CreationContainer = () => {
	const history = useHistory();
	const {
		properties: { defaultContributor },
	} = useAppContext();
	const collection = emptyCollection(defaultContributor);

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [submitting, setSubmitting] = useState(false);

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
			submitting={submitting}
			setSubmitting={setSubmitting}
		/>
	);
};
export default CreationContainer;
