import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import { ERROR, OK, PENDING } from 'js/constants';
import SendStatus from './status';
import CollectionSend from './home';
import { useParams } from 'react-router-dom';
import api from '../../../remote-api/concepts-api';


const CollectionSendContainer = () => {
	const { id } = useParams();
	const [general, setGeneral] = useState();
	const [loading, setLoading] = useState(true);
	const [sending, setSending] = useState();

	const properties = useSelector(state => state.app.properties)
	useEffect(() => {
		api.getCollectionGeneral(id)
			.then(body => setGeneral(body))
			.finally(() => setLoading(false))
	}, [id])

	const handleCollectionSend = (id, data) => {
		setSending(PENDING)
		api.postCollectionSend(id, data)
			.then(() => setSending(OK))
			.catch(() => setSending(ERROR));
	}
	if (loading || !properties) return <Loading />;

	const { prefLabelLg1, isValidated } = general

	if (sending) {
		const urlBack = sending === OK ? '/collections' : `/collection/${id}`;
		return (
			<SendStatus
				label={prefLabelLg1}
				status={sending}
				urlBack={urlBack}
			/>
		);
	}

	return (
		<CollectionSend
			id={id}
			prefLabelLg1={prefLabelLg1}
			isValidated={isValidated}
			properties={properties}
			sendCollection={handleCollectionSend}
		/>
	);

}

export default CollectionSendContainer;
