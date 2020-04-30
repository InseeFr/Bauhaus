import React, { useState, useEffect } from 'react';
import Edition from '../component';
import { StructureAPI } from 'bauhaus-structures';
import { useLocation, useParams } from 'react-router-dom';
const Update = () => {
	const location = useLocation();
	const { dsdId } = useParams();

	const [DSD, setDSD] = useState({});
	const [components, setComponents] = useState([]);
	useEffect(() => {
		StructureAPI.getStructure(dsdId).then(res => setDSD(res));
		StructureAPI.getStructureDetailedComponents(dsdId).then(res =>
			setComponents(res)
		);
	}, [dsdId]);
	const duplicate = location.pathname.indexOf('/duplicate') >= 0;
	return (
		<Edition
			creation={duplicate}
			initDSD={{
				...DSD,
				id: duplicate ? '' : DSD.id,
				components: components.map(({ codeList, ...c }) => ({
					...c,
					codeList,
					isCoded: codeList ? true : false,
				})),
			}}
		/>
	);
};

export default Update;
