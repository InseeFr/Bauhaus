import React, { useState, useCallback, useEffect } from 'react';
import './component-selector.scss';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';
import ComponentSpecificationModal from '../component-specification-modal';
import PropTypes from 'prop-types';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';

const ComponentSelector = ({
	components,
	mutualizedComponents,
	concepts,
	codesLists,
	handleUpdate,
}) => {
	const [structureComponents, setStructureComponents] = useState(components);

	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

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

	const handleSpecificationClick = useCallback(component => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);

	const handleCreateOrUpdate = useCallback(
		(components, isCreation, component) => {
			setStructureComponents(components);
			handleUpdate(components);

			if (isCreation) {
				_handleAttributeComponent(component);
			}
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

	const saveSpecification = useCallback(
		specification => {
			const update = structureComponents.find(
				c => c.id === selectedComponent.id
			);
			const component = {
				...selectedComponent,
				...specification,
			};
			let components;
			if (!!update) {
				components = structureComponents.map(c => {
					if (c.id === component.id) {
						return component;
					}
					return c;
				});
			} else {
				components = [...structureComponents, component];
			}

			setStructureComponents(components);
			handleUpdate(components);
			setSelectedComponent({});

			setModalOpened(false);
		},
		[handleUpdate, structureComponents, selectedComponent]
	);

	const _handleAttributeComponent = component => {
		if (component.type === ATTRIBUTE_TYPE) {
			setSelectedComponent(component);
			setModalOpened(true);
		}
	};

	const handleAdd = useCallback(
		id => {
			const component = mutualizedComponents.find(c => c.id === id);
			const components = [...structureComponents, component];
			setStructureComponents(components);
			handleUpdate(components);

			_handleAttributeComponent(component);
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
			{modalOpened && (
				<ComponentSpecificationModal
					onClose={() => setModalOpened(false)}
					structureComponents={structureComponents}
					specification={{
						attachment: selectedComponent.attachment,
						required: selectedComponent.required,
					}}
					onSave={saveSpecification}
				/>
			)}

			<StructureComponentsSelector
				hidden={false}
				codesLists={codesLists}
				concepts={concepts}
				components={structureComponents}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
				handleCreateOrUpdate={handleCreateOrUpdate}
				handleSpecificationClick={handleSpecificationClick}
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
