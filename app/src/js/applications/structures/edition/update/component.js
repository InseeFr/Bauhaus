import React, { useState, useEffect } from 'react';
import Edition from '../component';
import { buildExtract } from '@inseefr/wilco';
import { StructureAPI } from 'bauhaus-structures';

const Update = props => {
	const [DSD, setDSD] = useState({});
	const [components, setComponents] = useState([]);

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		StructureAPI.getStructure(dsdId).then(res => setDSD(res));
		StructureAPI.getStructureDetailedComponents(dsdId).then(res =>
			setComponents(res)
		);
	}, [props]);

	return (
		<Edition
			initDSD={{
				...DSD,
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
