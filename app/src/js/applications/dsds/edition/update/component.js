import React, { useState, useEffect } from 'react';
import Edition from '../component';
import buildExtract from '@inseefr/wilco/src/utils/build-extract';
import API from 'js/remote-api/dsds/dsds-api';

const Update = props => {
	const [DSD, setDSD] = useState({});
	const [components, setComponents] = useState([]);

	useEffect(() => {
		const dsdId = buildExtract('dsdId')(props);
		API.getDSD(dsdId).then(res => setDSD(res));
		API.getDSDDetailedComponents(dsdId).then(res => setComponents(res));
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
