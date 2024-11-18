import { useEffect, useState } from 'react';
import { Loading } from '@components/loading';
import CorrespondencesHome from './home';
import { ClassificationsApi } from '../..//sdk/classification';

export const Component = () => {
	const [correspondences, setCorrespondences] = useState();

	useEffect(() => {
		ClassificationsApi.getCorrespondencesList().then(setCorrespondences);
	}, []);

	if (!correspondences) return <Loading />;
	return <CorrespondencesHome correspondences={correspondences} />;
};
