import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import ClassificationsHome from './home';
import api from 'js/remote-api/classifications-api';

const ClassificationsHomeContainer = () =>  {
	const [loading, setLoading] = useState(true);
	const [classifications, setClassifications] = useState();

	useEffect(() => {
		api.getList().then(result => setClassifications(result)).finally(() => setLoading(false))
	}, [])

	if (loading) return <Loading />;
	return <ClassificationsHome classifications={classifications} />;
}

export default ClassificationsHomeContainer
