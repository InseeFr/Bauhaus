import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	StructureAPI,
	ComponentSelector,
	getFormattedCodeList,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';

const Components = ({ onChange }) => {
	const { dsdId } = useParams();
	const [components, setComponents] = useState([]);
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [mutualizedComponents, setMutualizedComponents] = useState([]);
	useEffect(() => {
		StructureAPI.getComponents(dsdId).then(res => setComponents(res));
	}, [dsdId]);

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
				components={components}
				concepts={concepts}
				codesLists={codesLists}
				mutualizedComponents={mutualizedComponents}
				handleUpdate={onChange}
			/>
		</div>
	);
};

export default Components;
