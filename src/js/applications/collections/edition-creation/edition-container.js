import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as select from '../../../reducers';
import CollectionEditionCreation from './home';
import buildPayload from '../../../utils/collections/build-payload/build-payload';
import D from '../../../i18n';
import { cleanId } from '@inseefr/wilco';
import { Loading } from '../../../new-architecture/components';

import { ConceptsApi } from '../../../new-architecture/sdk';
import { useTitle } from '../../../utils';
import { CollectionApi } from '../../../new-architecture/sdk/collection-api';

const EditionContainer = () => {
	const { id } = useParams();
	const history = useHistory();
	const langs = useSelector((state) => select.getLangs(state));

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
