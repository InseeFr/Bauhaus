import { useEffect, useState } from 'react';
import { Loading } from 'js/new-architecture/components/loading/loading';
import CorrespondencesHome from './home';
import api from '../../../remote-api/classifications-api';

const CorrespondencesHomeContainer = () => {
	const [correspondences, setCorrespondences] = useState();

	useEffect(() => {
		api.getCorrespondencesList().then(setCorrespondences);
	}, []);

	if (!correspondences) return <Loading />;
	return <CorrespondencesHome correspondences={correspondences} />;
};
export default CorrespondencesHomeContainer;
