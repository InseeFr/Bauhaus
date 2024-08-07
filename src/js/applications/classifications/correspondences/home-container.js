import { useEffect, useState } from 'react';
import { Loading } from '../../../new-architecture/components';
import CorrespondencesHome from './home';
import { ClassificationsApi } from '../../../new-architecture/sdk/classification';

const CorrespondencesHomeContainer = () => {
	const [correspondences, setCorrespondences] = useState();

	useEffect(() => {
		ClassificationsApi.getCorrespondencesList().then(setCorrespondences);
	}, []);

	if (!correspondences) return <Loading />;
	return <CorrespondencesHome correspondences={correspondences} />;
};
export default CorrespondencesHomeContainer;
