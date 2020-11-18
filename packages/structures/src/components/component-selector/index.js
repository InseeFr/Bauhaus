import React, { useState, useCallback, useEffect } from 'react';
import './component-selector.scss';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';
import ComponentSpecificationModal from '../component-specification-modal';
import PropTypes from 'prop-types';
import { ATTRIBUTE_TYPE } from '../../utils/constants/dsd-components';
import { CodesListPanel } from "../codes-list-panel/codes-list-panel"

const filterComponentDefinition = (type) => (componentDefinition) =>
	componentDefinition?.component?.type === type;

const filterComponent = (type) => (component) => component?.type === type;

const ComponentSelector = ({
	componentDefinitions,
	mutualizedComponents,
	concepts,
	codesLists,
	handleUpdate,
	type,
}) => {
	const [codesListNotation, setCodesListNotation] = useState(undefined);
	const handleCodesListDetail = useCallback(notation => {
		setCodesListNotation(notation);
	}, [])
	const [structureComponents, setStructureComponents] = useState(
		[]
	);

	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

	const [
		filteredMutualizedComponents,
		setFilteredMutualizedComponents,
	] = useState(mutualizedComponents);

	useEffect(() => {
		setStructureComponents(componentDefinitions.filter(filterComponentDefinition(type)));
	}, [componentDefinitions, type]);

	useEffect(() => {
		setFilteredMutualizedComponents(
			mutualizedComponents.filter(filterComponent(type)).filter((component) => {
				return !structureComponents.find(
					({ component: c }) => c.id === component.id
				);
			})
		);
	}, [mutualizedComponents, structureComponents, type]);

	const handleSpecificationClick = useCallback((component) => {
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
		(id) => {
			const filteredComponents = structureComponents
				.filter(({ component }) => component.identifiant !== id)
				.map((c, index) => ({ ...c, order: index + 1 }));
			setStructureComponents(filteredComponents);
			handleUpdate(filteredComponents);
		},
		[handleUpdate, structureComponents]
	);

	const saveSpecification = useCallback(
		(specification) => {
			const component = {
				...selectedComponent,
				...specification,
			};
			let components;
			components = structureComponents.map((c) => {
				if (c.order === component.order) {
					return component;
				}
				return c;
			});

			setStructureComponents(components);
			handleUpdate(components);
			setSelectedComponent({});

			setModalOpened(false);
		},
		[handleUpdate, structureComponents, selectedComponent]
	);

	const _handleAttributeComponent = (component) => {
		if (component.type === ATTRIBUTE_TYPE) {
			setSelectedComponent(component);
			setModalOpened(true);
		}
	};

	const handleAdd = useCallback(
		(id) => {
			const component = mutualizedComponents.find((c) => c.identifiant === id);
			const components = [
				...structureComponents,
				{ component, order: structureComponents.length + 1 },
			];
			setStructureComponents(components);
			handleUpdate(components);

			_handleAttributeComponent(component);
		},
		[handleUpdate, mutualizedComponents, structureComponents]
	);

	const handleUp = useCallback(
		(id) => {
			const index = structureComponents.findIndex(
				(cs) => cs.component.identifiant === id
			);
			const startArray = structureComponents.slice(0, index - 1);
			const endArray = structureComponents.slice(index + 1);
			const components = [
				...startArray,
				{
					...structureComponents[index],
					order: structureComponents[index - 1].order,
				},
				{
					...structureComponents[index - 1],
					order: structureComponents[index].order,
				},
				...endArray,
			];
			setStructureComponents(components);

			handleUpdate(components);
		},

		[handleUpdate, structureComponents]
	);
	const handleDown = useCallback(
		(id) => {
			const index = structureComponents.findIndex(
				(cs) => cs.component.identifiant === id
			);
			const startArray = structureComponents.slice(0, index);
			const endArray = structureComponents.slice(index + 2);
			const components = [
				...startArray,
				{
					...structureComponents[index + 1],
					order: structureComponents[index].order,
				},
				{
					...structureComponents[index],
					order: structureComponents[index + 1].order,
				},
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
				componentDefinitions={structureComponents}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
				handleCreateOrUpdate={handleCreateOrUpdate}
				handleSpecificationClick={handleSpecificationClick}
				readOnly={false}
				type={type}
				handleCodesListDetail={handleCodesListDetail}
			/>

			<MutualizedComponentsSelector
				concepts={concepts}
				codesLists={codesLists}
				hidden={true}
				components={filteredMutualizedComponents}
				handleAdd={handleAdd}
				readOnly={true}
				handleCodesListDetail={handleCodesListDetail}
			/>
			<CodesListPanel codesList={codesListNotation} isOpen={!!codesListNotation} handleBack={() => setCodesListNotation(undefined)}/>
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
