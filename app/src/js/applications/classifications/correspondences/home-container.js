import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import CorrespondencesHome from './home';
import api from '../../../remote-api/classifications-api';
import { ArrayUtils } from 'bauhaus-utilities';

const CorrespondencesHomeContainer = () => {
	const [correspondences, setCorrespondences] = useState();

	useEffect(() => {
		api.getCorrespondencesList().then(results => {
			setCorrespondences(ArrayUtils.sortArrayByLabel(results))
		})
	}, [])

	if (!correspondences) return <Loading />;
	return <CorrespondencesHome correspondences={correspondences} />;

}
export default CorrespondencesHomeContainer
