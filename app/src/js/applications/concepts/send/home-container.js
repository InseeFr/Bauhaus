import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import { ERROR, OK, PENDING } from 'js/constants';
import SendStatus from './status';
import ConceptSend from './home';
import { useParams } from 'react-router-dom';
import api from '../../../remote-api/concepts-api';

const ConceptSendContainer = () => {
	const { id } = useParams();
	const properties = useSelector(state => state.app.properties);
	const [loading, setLoading] = useState(true);
	const [general, setGeneral] = useState();
	const [sending, setSending] = useState();

	useEffect(() => {
		api.getConceptGeneral(id)
			.then(body => setGeneral(body))
			.finally(() => setLoading(false))
	}, [id])

	const handleConceptSend = (id, data) => {
		setSending(PENDING)
		api.postConceptSend(id, data)
			.then(() => setSending(OK))
			.catch(() => setSending(ERROR));
	};

	if (loading || !properties) return <Loading />;
	const { prefLabelLg1, isValidated } = general;

	if(sending){
		const urlBack = sending === OK ? '/concepts' : `/concept/${id}`;
		return (
			<SendStatus
				label={prefLabelLg1}
				status={sending}
				urlBack={urlBack}
			/>
		);
	}

	return (
		<ConceptSend
			id={id}
			prefLabelLg1={prefLabelLg1}
			isValidated={isValidated}
			properties={properties}
			sendConcept={handleConceptSend}
		/>
	);
}

export default ConceptSendContainer;
