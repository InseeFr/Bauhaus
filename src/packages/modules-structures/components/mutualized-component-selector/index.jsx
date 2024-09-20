import { useCallback, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { ComponentDetail } from '../component-detail';

import Representation from '../representation';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { Column, SeeButton } from '../../../components';
import { DataTable } from '../../../components/datatable';

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
			component.validationState !== UNPUBLISHED ? (
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
				<SeeButton
					data-component-id={component.identifiant}
					onClick={seeClickHandler}
				></SeeButton>
				<button
					className="btn btn-default"
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
			<DataTable
				value={componentsWithActions}
				withPagination={false}
				globalFilterFields={[
					'labelLg1',
					'type',
					'mutualized',
					'concept',
					'representation',
				]}
			>
				<Column field="labelLg1" header={D.label}></Column>
				<Column field="type" header={D.type}></Column>
				<Column field="mutualized" header={D.mutualized}></Column>
				<Column field="concept" header={D.conceptTitle}></Column>
				<Column field="representation" header={D.representationTitle}></Column>
				<Column
					field="actions"
					header={``}
					style={{ display: 'flex' }}
				></Column>
			</DataTable>

			<SlidingPanel
				type="right"
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
