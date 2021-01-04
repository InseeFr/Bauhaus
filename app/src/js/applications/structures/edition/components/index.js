import React, { useState, useEffect } from 'react';
import {
	StructureAPI,
	ComponentSelector,
	getFormattedCodeList,
	StructureConstants,
} from 'bauhaus-structures';
import { ConceptsAPI } from 'bauhaus-utilities';
import D from 'js/i18n';

const Components = ({ componentDefinitions, onChange, structure = {}  }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [mutualizedComponents, setMutualizedComponents] = useState([]);

	useEffect(() => {
		ConceptsAPI.getConceptList().then((res) => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then((res) => setCodesLists(res));
	}, []);
	useEffect(() => {
		StructureAPI.getMutualizedComponents().then((res) =>
			setMutualizedComponents(res)
		);
	}, []);
	return (
		<>
			<h2>{D.Dimension}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={StructureConstants.DIMENSION_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
			<h2>{D.Measure}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={StructureConstants.MEASURE_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
			<h2>{D.Attribute}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={StructureConstants.ATTRIBUTE_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
		</>
	);
};

export default Components;
