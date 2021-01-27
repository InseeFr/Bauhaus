import React, { useCallback, useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel, defaultComponentsTableParams } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { Table } from '@inseefr/wilco';
import { ComponentDetail } from '../component-detail';

import PropTypes from 'prop-types';

export const MutualizedComponentsSelector = ({
	hidden = false,
	components,
	handleAdd,
	concepts,
	codesLists,
	handleCodesListDetail
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
		mutualized: (
			component.validationState !== 'Unpublished'
				? <span className="glyphicon glyphicon-ok" aria-label={D.mutualized}></span>
				: <React.Fragment></React.Fragment>
		),
		concept: concepts.find(({ id }) =>
			component.concept?.toString().includes(id?.toString())
		)?.label,
		codeList:
			codesLists.find(
				({ id }) => id?.toString() === component.codeList?.toString()
			)?.label || '',

		actions: (
			<React.Fragment>
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
				{
					component.codeList &&
					<button
						onClick={() => {
							const codesList = codesLists.find(({id}) => id?.toString() === component.codeList?.toString())
							handleCodesListDetail(codesList)
						}}
						aria-label={D.seeCodesListDetails}
						title={D.seeCodesListDetails}>
						<span className="glyphicon glyphicon-th"></span>
					</button>
				}
			</React.Fragment>
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
			<SlidingPanel type={'right'} isOpen={openPanel} size={60} backdropClicked={() => setOpenPanel(false)}>
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

MutualizedComponentsSelector.propTypes = {
	hidden: PropTypes.bool,
	components: PropTypes.array,
	handleAdd: PropTypes.func,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
};
