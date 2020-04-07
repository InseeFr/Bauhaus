import React, { useCallback, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { Table } from '@inseefr/wilco';
import { ComponentDetail } from '../component-detail';
import { defaultComponentsTableParams } from '../../utils';

export const StructureComponentsSelector = ({
	hidden = false,
	components,
	handleRemove,
	handleUp,
	handleDown,
	concepts,
	codesLists,
}) => {
	const removeClickHandler = useCallback(
		e => {
			handleRemove(e.target.parentElement.dataset.componentId);
		},
		[handleRemove]
	);
	const [openPanel, setOpenPanel] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState(null);
	const seeClickHandler = useCallback(
		e => {
			const component = components.find(
				c => c.id === e.target.parentElement.dataset.componentId
			);
			setSelectedComponent(component);
			setOpenPanel(true);
		},
		[components]
	);

	const goingUp = useCallback(
		e => {
			handleUp(e.target.parentElement.dataset.componentId);
		},
		[handleUp]
	);
	const goingDown = useCallback(
		e => {
			handleDown(e.target.parentElement.dataset.componentId);
		},
		[handleDown]
	);

	const handleCreateComponent = useCallback(e => {
		e.stopPropagation();
		setSelectedComponent({});
		setOpenPanel(true);
	}, []);
	const componentsWithActions = components.map((component, i) => ({
		...component,
		type: typeUriToLabel(component.type),
		concept: concepts[component.concept]?.label,
		codeList: codesLists[component.codeList]?.label,
		actions: (
			<React.Fragment>
				<button
					data-component-id={component.id}
					onClick={seeClickHandler}
					aria-label={D.see}
				>
					<span className="glyphicon glyphicon-eye-open"></span>
				</button>
				<button
					data-component-id={component.id}
					onClick={removeClickHandler}
					aria-label={D.remove}
				>
					<span className="glyphicon glyphicon-minus"></span>
				</button>
				{i !== 0 && (
					<button
						data-component-id={component.id}
						onClick={goingUp}
						aria-label={D.up}
					>
						<span className="glyphicon glyphicon-arrow-up"></span>
					</button>
				)}
				{i !== components.length - 1 && (
					<button
						data-component-id={component.id}
						onClick={goingDown}
						aria-label={D.down}
					>
						<span className="glyphicon glyphicon-arrow-down"></span>
					</button>
				)}
			</React.Fragment>
		),
	}));
	return (
		<CollapsiblePanel
			id="components-picker"
			hidden={hidden}
			collapsible={false}
			title={
				<React.Fragment>
					{D.componentTitle}{' '}
					<button
						id="add-component"
						aria-label={D.addComponentTitle}
						onClick={handleCreateComponent}
					>
						<span className="glyphicon glyphicon-plus"></span>
					</button>
				</React.Fragment>
			}
		>
			<Table
				rowParams={defaultComponentsTableParams}
				data={componentsWithActions}
				search={false}
				pagination={false}
			/>
			<SlidingPanel type={'right'} isOpen={openPanel} size={60}>
				<ComponentDetail
					component={selectedComponent}
					codesLists={codesLists}
					concepts={concepts}
					handleSave={() => {}}
					handleBack={() => {
						setOpenPanel(false);
					}}
				/>
			</SlidingPanel>
		</CollapsiblePanel>
	);
};
