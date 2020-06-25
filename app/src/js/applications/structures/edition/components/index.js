import React, { useState, useEffect } from 'react';
import {
	StructureAPI,
	ComponentSelector,
	getFormattedCodeList,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';

const Components = ({ componentDefinitions, onChange }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [mutualizedComponents, setMutualizedComponents] = useState([]);

	useEffect(() => {
		ConceptsAPI.getConceptList().then(res => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then(res => setCodesLists(res));
	}, []);
	useEffect(() => {
		StructureAPI.getMutualizedComponents().then(res =>
			setMutualizedComponents(res)
		);
	}, []);
	return (
		<div className="row text-left">
			<ComponentSelector
				componentDefinitions={componentDefinitions}
				concepts={concepts}
				codesLists={codesLists}
				mutualizedComponents={mutualizedComponents}
				handleUpdate={onChange}
			/>
		</div>
	);
};

export default Components;
