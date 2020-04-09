import React, { useState, useCallback } from 'react';
import './component-selector.scss';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';

import PropTypes from 'prop-types';

const ComponentSelector = ({
	components = [],
	mutualizedComponents,
	concepts = [],
	codesLists = [],
}) => {
	const [structureComponents, setStructureComponents] = useState(components);

	const filteredMutualizedComponents = mutualizedComponents.filter(
		component => {
			return !structureComponents.find(c => c.id === component.id);
		}
	);
	const handleRemove = useCallback(
		id => {
			const filteredComponents = structureComponents.filter(c => c.id !== id);
			setStructureComponents(filteredComponents);
		},
		[structureComponents]
	);
	const handleAdd = useCallback(
		id => {
			const component = mutualizedComponents.find(c => c.id === id);
			setStructureComponents([...structureComponents, component]);
		},
		[mutualizedComponents, structureComponents]
	);

	const handleUp = useCallback(
		id => {
			const data = [...structureComponents];
			const index = data.findIndex(component => component.id === id);
			const temp = data[index];
			data[index] = data[index - 1];
			data[index - 1] = temp;
			setStructureComponents(data);
		},
		[structureComponents]
	);
	const handleDown = useCallback(
		id => {
			const data = [...structureComponents];
			const index = data.findIndex(component => component.id === id);
			const temp = data[index];
			data[index] = data[index + 1];
			data[index + 1] = temp;
			setStructureComponents(data);
		},
		[structureComponents]
	);

	const conceptsObject = concepts.reduce(
		(acc, concept) => ({ ...acc, [concept.id]: { ...concept } }),
		{}
	);

	const codesListsObject = codesLists.reduce(
		(acc, code) => ({ ...acc, [code.id]: { ...code } }),
		{}
	);

	return (
		<>
			<StructureComponentsSelector
				hidden={false}
				codesLists={codesListsObject}
				concepts={conceptsObject}
				components={structureComponents}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
			/>
			<MutualizedComponentsSelector
				concepts={conceptsObject}
				codesLists={codesListsObject}
				hidden={true}
				components={filteredMutualizedComponents}
				handleAdd={handleAdd}
			/>
		</>
	);
};

ComponentSelector.propTypes = {
	components: PropTypes.array,
	mutualizedComponents: PropTypes.array,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
};

export default ComponentSelector;
