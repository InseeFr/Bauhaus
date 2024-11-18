import { useState, useCallback, useEffect } from 'react';

import { StructureApi } from '../../../sdk';
import { OBSERVATION } from '../../utils/constants';
import {
	ATTRIBUTE_PROPERTY_TYPE,
	ATTRIBUTE_TYPE,
	DIMENSION_PROPERTY_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants/dsd-components';
import { CodesListPanel } from '../codes-list-panel/codes-list-panel';
import ComponentSpecificationModal from '../component-specification-modal';
import { MutualizedComponentsSelector } from '../mutualized-component-selector';
import { StructureComponentsSelector } from '../structure-component-selector';
import './component-selector.scss';

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
	structure,
}) => {
	const [codesListNotation, setCodesListNotation] = useState(undefined);
	const handleCodesListDetail = useCallback((notation) => {
		setCodesListNotation(notation);
	}, []);
	const [structureComponents, setStructureComponents] = useState([]);

	const [modalOpened, setModalOpened] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState({});

	const [filteredMutualizedComponents, setFilteredMutualizedComponents] =
		useState(mutualizedComponents);

	useEffect(() => {
		setStructureComponents(componentDefinitions);
	}, [componentDefinitions]);

	useEffect(() => {
		setFilteredMutualizedComponents(
			mutualizedComponents.filter(filterComponent(type)).filter((component) => {
				return !structureComponents.find(
					({ component: c }) => c.id === component.id,
				);
			}),
		);
	}, [mutualizedComponents, structureComponents, type]);

	const handleSpecificationClick = useCallback((component) => {
		setSelectedComponent(component);
		setModalOpened(true);
	}, []);

	const handleCreateOrUpdate = useCallback(
		(components, isCreation, component) => {
			if (isCreation) {
				const componentsByType = _groupByType(structureComponents);
				componentsByType[component.component.type].push(component);

				const newComponents = _makeFlat(componentsByType);
				_handleAttributeComponent(component);
				setStructureComponents(newComponents);
				handleUpdate(newComponents);
			} else {
				setStructureComponents(components);
				handleUpdate(components);
			}
		},
		[handleUpdate, structureComponents],
	);

	const handleRemove = useCallback(
		(id) => {
			const filteredComponentsByType = _groupByType(
				structureComponents.filter(
					({ component }) => component.identifiant !== id,
				),
			);

			const filteredComponents = _makeFlat(filteredComponentsByType);
			setStructureComponents(filteredComponents);
			handleUpdate(filteredComponents);
		},
		[handleUpdate, structureComponents],
	);

	const saveSpecification = useCallback(
		(specification) => {
			const component = {
				...selectedComponent,
				...specification,
			};
			let components;
			components = structureComponents.map((c) => {
				if (
					c.order === component.order &&
					c.component.type === component.component.type
				) {
					return component;
				}
				return c;
			});

			setStructureComponents(components);
			handleUpdate(components);
			setSelectedComponent({});

			setModalOpened(false);
		},
		[handleUpdate, structureComponents, selectedComponent],
	);

	const _handleAttributeComponent = (component) => {
		if (component.type === ATTRIBUTE_TYPE) {
			setSelectedComponent(component);
			setModalOpened(true);
		}
	};

	const _groupByType = (components) => {
		const componentsByType = components.reduce(
			(acc, structureComponent) => {
				return {
					...acc,
					[structureComponent.component.type]: [
						...acc[structureComponent.component.type],
						structureComponent,
					],
				};
			},
			{
				[ATTRIBUTE_PROPERTY_TYPE]: [],
				[DIMENSION_PROPERTY_TYPE]: [],
				[MEASURE_PROPERTY_TYPE]: [],
			},
		);
		return componentsByType;
	};

	const _makeFlat = (componentsByType) => {
		const dimensions = componentsByType[DIMENSION_PROPERTY_TYPE];
		const measures = componentsByType[MEASURE_PROPERTY_TYPE];
		return [
			...dimensions.map((component, index) => ({
				...component,
				order: index + 1,
			})),
			...measures.map((component, index) => ({
				...component,
				order: dimensions.length + index + 1,
			})),
			...componentsByType[ATTRIBUTE_PROPERTY_TYPE].map((component, index) => ({
				...component,
				order: dimensions.length + measures.length + index + 1,
			})),
		];
	};

	const addComponent = useCallback(
		(structureComponents, components) => {
			const componentsToAdd = Array.isArray(components)
				? components
				: [components];
			const componentsByType = _groupByType(structureComponents);
			componentsToAdd.forEach((component, i) => {
				const newStructureComponent = {
					component,
					order: componentsByType[component.type].length + 1,
				};

				// If the main component added is an attribute, we add the Observation attachment
				if (component.type === ATTRIBUTE_PROPERTY_TYPE) {
					if (i === 0) {
						newStructureComponent.attachment = [OBSERVATION];
					} else {
						// Else this is a linked attribute to a measure
						newStructureComponent.attachment = [components[0].id];
					}
				}
				componentsByType[component.type].push(newStructureComponent);
			});

			const flatComponents = _makeFlat(componentsByType);

			setStructureComponents(flatComponents);
			handleUpdate(flatComponents);

			_handleAttributeComponent(componentsToAdd[0]);
		},
		[handleUpdate],
	);
	const handleAdd = useCallback(
		(id) => {
			const component = mutualizedComponents.find((c) => c.identifiant === id);
			if (component.type === MEASURE_PROPERTY_TYPE) {
				StructureApi.getMutualizedComponent(component.id).then(
					(fullComponent) => {
						const componentsToAdd = [component];
						Object.keys(fullComponent)
							.filter((key) => key.startsWith('attribute_'))
							.forEach((iri) => {
								const attribute = mutualizedComponents.find(
									(c) => c.iri === fullComponent[iri],
								);

								componentsToAdd.push(attribute);
							});
						addComponent(structureComponents, componentsToAdd);
					},
				);
			} else {
				addComponent(structureComponents, component);
			}
		},
		[mutualizedComponents, structureComponents, addComponent],
	);

	const handleUp = useCallback(
		(id) => {
			const structureComponent = structureComponents.find(
				(cs) => cs.component.identifiant === id,
			);
			const componentByType = _groupByType(structureComponents);
			const componentArrayToUpdate =
				componentByType[structureComponent.component.type];

			const index = structureComponent.order - 1;
			const startArray = componentArrayToUpdate.slice(0, index - 1);
			const endArray = componentArrayToUpdate.slice(index + 1);

			componentByType[structureComponent.component.type] = [
				...startArray,
				{
					...componentArrayToUpdate[index],
					order: structureComponents[index - 1].order,
				},
				{
					...componentArrayToUpdate[index - 1],
					order: structureComponents[index].order,
				},
				...endArray,
			];

			const components = _makeFlat(componentByType);
			setStructureComponents(components);
			handleUpdate(components);
		},

		[handleUpdate, structureComponents],
	);
	const handleDown = useCallback(
		(id) => {
			const structureComponent = structureComponents.find(
				(cs) => cs.component.identifiant === id,
			);
			const componentByType = _groupByType(structureComponents);
			const componentArrayToUpdate =
				componentByType[structureComponent.component.type];

			const index = structureComponent.order - 1;

			const startArray = componentArrayToUpdate.slice(0, index);
			const endArray = componentArrayToUpdate.slice(index + 2);
			componentByType[structureComponent.component.type] = [
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
			const components = _makeFlat(componentByType);
			setStructureComponents(components);
			handleUpdate(components);
		},
		[handleUpdate, structureComponents],
	);

	return (
		<>
			{modalOpened && (
				<ComponentSpecificationModal
					onClose={() => setModalOpened(false)}
					structureComponents={structureComponents}
					selectedComponent={selectedComponent}
					specification={{
						attachment: selectedComponent.attachment,
						required: selectedComponent.required,
						notation: selectedComponent.notation,
						labelLg1: selectedComponent.labelLg1,
						labelLg2: selectedComponent.labelLg2,
					}}
					onSave={saveSpecification}
				/>
			)}

			<StructureComponentsSelector
				hidden={false}
				codesLists={codesLists}
				concepts={concepts}
				componentDefinitions={componentDefinitions.filter(
					filterComponentDefinition(type),
				)}
				handleRemove={handleRemove}
				handleUp={handleUp}
				handleDown={handleDown}
				handleCreateOrUpdate={handleCreateOrUpdate}
				handleSpecificationClick={handleSpecificationClick}
				readOnly={false}
				type={type}
				handleCodesListDetail={handleCodesListDetail}
				structure={structure}
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
			<CodesListPanel
				codesList={codesListNotation}
				isOpen={!!codesListNotation}
				handleBack={() => setCodesListNotation(undefined)}
			/>
		</>
	);
};

ComponentSelector.defaultProps = {
	components: [],
	concepts: [],
	codesLists: [],
};
export default ComponentSelector;
