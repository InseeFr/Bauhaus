import React, { useState, useCallback, useEffect } from 'react';
import './component-selector.scss';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';

import PropTypes from 'prop-types';

const ComponentSelector = ({
	components,
	mutualizedComponents,
	concepts,
	codesLists,
	handleUpdate,
}) => {
	const [structureComponents, setStructureComponents] = useState(components);
	const [
		filteredMutualizedComponents,
		setFilteredMutualizedComponents,
	] = useState(mutualizedComponents);

	useEffect(() => {
		setStructureComponents(components);
	}, [components]);
	useEffect(() => {
		setFilteredMutualizedComponents(
			mutualizedComponents.filter(component => {
				return !structureComponents.find(c => c.id === component.id);
			})
		);
	}, [mutualizedComponents, structureComponents]);

	const handleCreateOrUpdate = useCallback(
		components => {
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate]
	);

	const handleRemove = useCallback(
		id => {
			const filteredComponents = structureComponents.filter(c => c.id !== id);
			setStructureComponents(filteredComponents);
			handleUpdate(filteredComponents);
		},
		[handleUpdate, structureComponents]
	);
	const handleAdd = useCallback(
		id => {
			const component = mutualizedComponents.find(c => c.id === id);
			const components = [...structureComponents, component];
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate, mutualizedComponents, structureComponents]
	);

	const handleUp = useCallback(
		id => {
			const index = structureComponents.findIndex(
				component => component.id === id
			);
			const startArray = structureComponents.slice(0, index - 1);
			const endArray = structureComponents.slice(index + 1);
			const components = [
				...startArray,
				structureComponents[index],
				structureComponents[index - 1],
				...endArray,
			];
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate, structureComponents]
	);
	const handleDown = useCallback(
		id => {
			const index = structureComponents.findIndex(
				component => component.id === id
			);
			const startArray = structureComponents.slice(0, index);
			const endArray = structureComponents.slice(index + 2);
			const components = [
				...startArray,
				structureComponents[index + 1],
				structureComponents[index],
				...endArray,
			];
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate, structureComponents]
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
				handleCreateOrUpdate={handleCreateOrUpdate}
				readOnly={false}
			/>
			<MutualizedComponentsSelector
				concepts={concepts}
				codesLists={codesLists}
				hidden={true}
				components={filteredMutualizedComponents}
				handleAdd={handleAdd}
				readOnly={true}
			/>
		</>
	);
};

ComponentSelector.propTypes = {
	components: PropTypes.array,
	mutualizedComponents: PropTypes.array,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	handleUpdate: PropTypes.func,
};

ComponentSelector.defaultProps = {
	components: [],
	concepts: [],
	codesLists: [],
};
export default ComponentSelector;
