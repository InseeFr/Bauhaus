import React, { useState, useEffect } from 'react';
import Edition from '../component';
import { Loading } from '@inseefr/wilco';
import { StructureAPI } from 'bauhaus-structures';
import { useLocation, useParams } from 'react-router-dom';
const Update = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const { dsdId } = useParams();

	const [DSD, setDSD] = useState({});
	useEffect(() => {
		StructureAPI.getStructure(dsdId)
			.then(res => setDSD(res))
			.finally(() => {
				setLoading(false);
			});
	}, [dsdId]);
	const duplicate = location.pathname.indexOf('/duplicate') >= 0;

	if (loading) return <Loading />;

	return (
		<Edition
			creation={duplicate}
			initDSD={{
				...DSD,
				id: duplicate ? '' : DSD.id,
			}}
		/>
	);
};

export default Update;
