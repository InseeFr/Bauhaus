import React from 'react';
import { Loading } from '@inseefr/wilco';
import AssociationHome from './home';
import * as mainSelect from 'js/reducers';
import { Stores } from 'js/utils';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from 'js/remote-api/classifications-api';
import { useSelector } from 'react-redux';

const AssociationHomeContainer = () => {
	const { correspondenceId, associationId } = useParams();
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => mainSelect.getLangs(state));

	const { isLoading, data: association } = useQuery(
		['correspondences-association', correspondenceId, associationId],
		() => api.getCorrespondenceAssociation(correspondenceId, associationId)
	);

	if (isLoading) return <Loading />;
	return (
		<AssociationHome
			association={association}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};

export default AssociationHomeContainer;
