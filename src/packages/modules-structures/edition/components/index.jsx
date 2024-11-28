import { useState, useEffect } from 'react';

import { ConceptsApi, StructureApi } from '@sdk/index';

import D from '../../../deprecated-locales';
import { getFormattedCodeList } from '../../apis';
import ComponentSelector from '../../components/component-selector';
import {
	ATTRIBUTE_PROPERTY_TYPE,
	DIMENSION_PROPERTY_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants';

const Components = ({ componentDefinitions, onChange, structure = {} }) => {
	const [concepts, setConcepts] = useState([]);
	const [codesLists, setCodesLists] = useState([]);
	const [mutualizedComponents, setMutualizedComponents] = useState([]);

	useEffect(() => {
		ConceptsApi.getConceptList().then((res) => setConcepts(res));
	}, []);

	useEffect(() => {
		getFormattedCodeList().then((res) => setCodesLists(res));
	}, []);
	useEffect(() => {
		StructureApi.getMutualizedComponents().then((res) =>
			setMutualizedComponents(res),
		);
	}, []);
	return (
		<>
			<h2>{D.DimensionPlural}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={DIMENSION_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
			<h2>{D.MeasurePlural}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={MEASURE_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
			<h2>{D.AttributePlural}</h2>
			<div className="row text-left">
				<ComponentSelector
					componentDefinitions={componentDefinitions}
					concepts={concepts}
					codesLists={codesLists}
					mutualizedComponents={mutualizedComponents}
					type={ATTRIBUTE_PROPERTY_TYPE}
					handleUpdate={onChange}
					structure={structure}
				/>
			</div>
		</>
	);
};

export default Components;
