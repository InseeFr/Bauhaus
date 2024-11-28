import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loading, Saving } from '@components/loading';

import { CollectionApi } from '@sdk/collection-api';
import { ConceptsApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';
import { cleanId } from '@utils/string-utils';

import { useAppContext } from '../../../application/app-context';
import D from '../../../deprecated-locales';
import emptyCollection from '../../collections/utils/empty-collection';
import buildPayload from '../utils/build-payload/build-payload';
import CollectionEditionCreation from './home';

export const Component = () => {
	const navigate = useNavigate();
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
					navigate(`/concepts/collections/${cleanId(data.general.id)}`);
				})
				.finally(() => setSaving(false));
		},
		[navigate],
	);

	const { general, members } = collection;
	useTitle(D.collectionsTitle, general?.prefLabelLg1);

	if (saving) {
		return <Saving />;
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
