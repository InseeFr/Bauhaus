import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loading, Saving } from '@components/loading';

import { CollectionApi } from '@sdk/collection-api';
import { ConceptsApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';
import { cleanId } from '@utils/string-utils';

import D from '../../../deprecated-locales';
import buildPayload from '../utils/build-payload/build-payload';
import CollectionEditionCreation from './home';

export const Component = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [loadingCollection, setLoadingCollection] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [collection, setCollection] = useState({});
	const [collectionList, setCollectionList] = useState([]);
	const [conceptList, setConceptList] = useState([]);

	useEffect(() => {
		Promise.all([
			ConceptsApi.getCollectionGeneral(id),
			ConceptsApi.getCollectionMembersList(id),
		])
			.then(([general, members]) => {
				setCollection({ general, members });
			})
			.finally(() => setLoadingCollection(false));
	}, [id]);

	useEffect(() => {
		Promise.all([
			ConceptsApi.getConceptList(),
			CollectionApi.getCollectionList(),
		])
			.then(([conceptsList, collectionsList]) => {
				setConceptList(conceptsList);
				setCollectionList(collectionsList);
			})
			.finally(() => setLoadingExtraData(false));
	}, []);

	const handleUpdate = useCallback(
		(data) => {
			setSaving(true);
			ConceptsApi.putCollection(data.general.id, buildPayload(data, 'UPDATE'))
				.then(() => {
					navigate(`/concepts/collections/${cleanId(id)}`);
				})
				.finally(() => setSaving(false));
		},
		[navigate, id],
	);

	const { general, members } = collection;
	useTitle(D.collectionsTitle, general?.prefLabelLg1);

	if (saving) {
		return <Saving />;
	}
	if (loadingCollection || loadingExtraData) {
		return <Loading />;
	}

	return (
		<CollectionEditionCreation
			title={D.updateCollectionTitle}
			subtitle={general.prefLabelLg1}
			general={general}
			members={members}
			collectionList={collectionList}
			conceptList={conceptList}
			save={handleUpdate}
			submitting={submitting}
			setSubmitting={setSubmitting}
		/>
	);
};
