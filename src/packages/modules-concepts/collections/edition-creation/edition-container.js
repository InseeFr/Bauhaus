import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import CollectionEditionCreation from './home';
import buildPayload from '../../../modules-concepts/collections/utils/build-payload/build-payload';
import D from '../../../deprecated-locales';
import { cleanId } from '@inseefr/wilco';
import { Loading } from '../../../components';

import { ConceptsApi } from '../../../sdk';
import { CollectionApi } from '../../../sdk/collection-api';
import { getLocales } from '../../../redux/selectors';
import { useTitle } from '../../../utils/hooks/useTitle';

const EditionContainer = () => {
	const { id } = useParams();
	const history = useHistory();
	const langs = useSelector((state) => getLocales(state));

	const [loadingCollection, setLoadingCollection] = useState(true);
	const [loadingExtraData, setLoadingExtraData] = useState(true);
	const [saving, setSaving] = useState(false);

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
					history.push(`/collection/${cleanId(id)}`);
				})
				.finally(() => setSaving(false));
		},
		[history, id]
	);

	const { general, members } = collection;
	useTitle(
		D.collectionsTitle,
		general?.prefLabelLg1 || D.createCollectionTitle
	);

	if (saving) {
		return <Loading textType="saving" />;
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
			langs={langs}
		/>
	);
};

export default EditionContainer;