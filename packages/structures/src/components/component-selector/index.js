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
			const index = structureComponents.findIndex(
				component => component.id === id
			);
			const startArray = structureComponents.slice(0, index - 1);
			const endArray = structureComponents.slice(index + 1);
			setStructureComponents([
				...startArray,
				structureComponents[index],
				structureComponents[index - 1],
				...endArray,
			]);
		},
		[structureComponents]
	);
	const handleDown = useCallback(
		id => {
			const index = structureComponents.findIndex(
				component => component.id === id
			);
			const startArray = structureComponents.slice(0, index);
			const endArray = structureComponents.slice(index + 2);
			setStructureComponents([
				...startArray,
				structureComponents[index + 1],
				structureComponents[index],
				...endArray,
			]);
		},
		[structureComponents]
	);

	return (
		<>
			<StructureComponentsSelector
				hidden={false}
				codesLists={codesLists}
				concepts={concepts}
				components={structureComponents}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
			/>
			<MutualizedComponentsSelector
				concepts={concepts}
				codesLists={codesLists}
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
