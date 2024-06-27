import { useCallback, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel, defaultComponentsTableParams } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { Table } from '@inseefr/wilco';
import { ComponentDetail } from '../component-detail';

import Representation from '../representation';

export const MutualizedComponentsSelector = ({
	hidden = false,
	components,
	handleAdd,
	concepts,
	codesLists,
	handleCodesListDetail,
}) => {
	const [openPanel, setOpenPanel] = useState(false);
	const [selectedComponent, setSelectedComponent] = useState(null);
	const seeClickHandler = useCallback(
		(e) => {
			const component = components.find(
				(c) => c.identifiant === e.target.parentElement.dataset.componentId
			);
			setSelectedComponent(component);
			setOpenPanel(true);
		},
		[components]
	);

	const addClickHandler = useCallback(
		(e) => {
			handleAdd(e.target.parentElement.dataset.componentId);
		},
		[handleAdd]
	);

	const componentsWithActions = components.map((component) => ({
		...component,
		type: typeUriToLabel(component.type),
		mutualized:
			!!component.validationState &&
			component.validationState !== 'Unpublished' ? (
				<span
					className="glyphicon glyphicon-ok"
					aria-label={D.mutualized}
				></span>
			) : (
				<></>
			),
		concept: concepts.find(({ id }) =>
			component.concept?.toString().includes(id?.toString())
		)?.label,
		representation: (
			<Representation
				component={component}
				codesLists={codesLists}
				handleCodesListDetail={() => {
					const codesList = codesLists.find(
						({ id }) => id?.toString() === component.codeList?.toString()
					);
					handleCodesListDetail(codesList);
				}}
			/>
		),
		actions: (
			<>
				<button
					data-component-id={component.identifiant}
					onClick={seeClickHandler}
					aria-label={D.see}
				>
					<span className="glyphicon glyphicon-eye-open"></span>
				</button>
				<button
					data-component-id={component.identifiant}
					onClick={addClickHandler}
					aria-label={D.add}
				>
					<span className="glyphicon glyphicon-plus"></span>
				</button>
			</>
		),
	}));

	return (
		<CollapsiblePanel
			id="mutualized-components-picker"
			hidden={hidden}
			title={D.mutualizedComponentTitle}
		>
			<Table
				rowParams={defaultComponentsTableParams}
				data={componentsWithActions}
				search={true}
				pagination={false}
			/>
			<SlidingPanel
				type={'right'}
				isOpen={openPanel}
				size={60}
				backdropClicked={() => setOpenPanel(false)}
			>
				<ComponentDetail
					component={selectedComponent}
					codesLists={codesLists}
					concepts={concepts}
					handleSave={() => {}}
					handleBack={() => {
						setOpenPanel(false);
					}}
					readOnly={true}
					mutualized={true}
				/>
			</SlidingPanel>
		</CollapsiblePanel>
	);
};
