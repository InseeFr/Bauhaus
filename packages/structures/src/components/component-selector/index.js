import React, { useState, useCallback } from 'react';
import { Note, Table } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';

import './component-selector.scss';
/**
 * TODO:
 * - pouvoir editer un composant dans CH
 * - Reorder
 * - Gerer l'affichage du type
 * - l'affichage des codelist et concepts
 */

const CollapsiblePanel = ({ id, title, children, hidden: hiddenProps }) => {
	const [hidden, setHidden] = useState(hiddenProps);
	const clickTitleHandler = useCallback(() => {
		setHidden(!hidden);
	}, [hidden]);

	const bodyId = `${id}-body`;
	const buttonId = `${id}-button`;

	return (
		<div className="bauhaus-collapsible-panel">
			<Note
				text={
					<div id={bodyId} aria-labelledby={buttonId} hidden={hidden}>
						{children}
					</div>
				}
				title={
					<button
						id={buttonId}
						aria-expanded={!hidden}
						aria-controls={bodyId}
						onClick={clickTitleHandler}
					>
						{title}{' '}
						<span
							className={`glyphicon glyphicon-chevron-${
								hidden ? 'down' : 'up'
							}`}
						/>
					</button>
				}
				alone={true}
			/>
		</div>
	);
};
const rowParams = [
	{
		dataField: 'labelLg1',
		text: D.label,
		width: '40%',
		isKey: true,
	},
	{
		dataField: 'type',
		text: D.type,
		width: '40%',
	},
	{
		dataField: 'actions',
		text: '',
		width: '20%',
	},
];
const MutualizedComponentsSelector = ({
	hidden = false,
	components,
	handleAdd,
}) => {
	const addClickHandler = useCallback(
		e => {
			handleAdd(e.target.parentElement.dataset.componentId);
		},
		[handleAdd]
	);
	const componentsWithActions = components.map(component => ({
		...component,
		actions: (
			<button
				data-component-id={component.id}
				onClick={addClickHandler}
				aria-label={D.add}
			>
				<span className="glyphicon glyphicon-plus"></span>
			</button>
		),
	}));

	return (
		<CollapsiblePanel
			id="mutualized-components-picker"
			hidden={hidden}
			title={D.mutualizedComponentTitle}
		>
			<Table
				rowParams={rowParams}
				data={componentsWithActions}
				search={true}
				pagination={false}
			/>
		</CollapsiblePanel>
	);
};
const StructureComponentsSelector = ({
	hidden = false,
	components,
	handleRemove,
}) => {
	const removeClickHandler = useCallback(
		e => {
			handleRemove(e.target.parentElement.dataset.componentId);
		},
		[handleRemove]
	);

	const componentsWithActions = components.map(component => ({
		...component,
		actions: (
			<button
				data-component-id={component.id}
				onClick={removeClickHandler}
				aria-label={D.remove}
			>
				<span className="glyphicon glyphicon-minus"></span>
			</button>
		),
	}));
	return (
		<CollapsiblePanel
			id="components-picker"
			hidden={hidden}
			title={D.componentTitle}
		>
			<Table
				rowParams={rowParams}
				data={componentsWithActions}
				search={false}
				pagination={false}
			/>
		</CollapsiblePanel>
	);
};
const ComponentSelector = ({ components = [], mutualizedComponents }) => {
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
	return (
		<>
			<StructureComponentsSelector
				hidden={false}
				components={structureComponents}
				handleRemove={handleRemove}
			/>
			<MutualizedComponentsSelector
				hidden={true}
				components={filteredMutualizedComponents}
				handleAdd={handleAdd}
			/>
		</>
	);
};

export default ComponentSelector;
