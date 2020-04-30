import React, { useState, useEffect } from 'react';
import {
	StructureComponentsSelector,
	getFormattedCodeList,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';

const Components = ({ components = [] }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

	useEffect(() => {
		ConceptsAPI.getConceptList().then(res => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then(res => setCodesLists(res));
	}, []);

	return (
		<div className="row text-left">
			<StructureComponentsSelector
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				readOnly={true}
			/>
		</div>
	);
};

export default Components;
