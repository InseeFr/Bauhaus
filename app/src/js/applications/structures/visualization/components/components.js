import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
	StructureAPI,
	StructureComponentsSelector,
	getFormattedCodeList,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';

const Components = props => {
	const { dsdId } = useParams();
	const [components, setComponents] = useState([]);
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);

	useEffect(() => {
		StructureAPI.getComponents(dsdId).then(res => setComponents(res));
	}, [dsdId]);

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
