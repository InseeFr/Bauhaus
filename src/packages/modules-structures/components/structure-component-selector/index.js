import { useCallback, useState, useEffect } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel, defaultComponentsTableParams } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { Table } from '@inseefr/wilco';
import { ComponentDetail } from '../component-detail';
import Auth from '../../../auth/components/auth';
import Representation from '../representation';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { useStampsOptions } from '../../../utils/hooks/stamps';
import { ADMIN } from '../../../auth/roles';

export const StructureComponentsSelector = ({
	hidden = false,
	componentDefinitions: defaultComponents,
	handleRemove,
	handleUp,
	handleDown,
	handleCreateOrUpdate,
	handleSpecificationClick,
	concepts,
	codesLists,
	readOnly,
	type,
	handleCodesListDetail,
	structure,
}) => {
	const removeClickHandler = useCallback(
		(e) => {
			handleRemove(e.target.parentElement.dataset.componentId);
		},
		[handleRemove]
	);
	const stampListOptions = useStampsOptions();
	const [openPanel, setOpenPanel] = useState(false);
	const [components, setComponents] = useState(defaultComponents);
	useEffect(() => {
		setComponents(defaultComponents);
	}, [defaultComponents]);

	const [selectedComponent, setSelectedComponent] = useState(null);

	const specificationClickHandler = useCallback(
		(e) => {
			if (e.target.parentElement.dataset.componentId) {
				const component = components.find(
					(c) =>
						c.component.identifiant ===
						e.target.parentElement.dataset.componentId
				);
				handleSpecificationClick(component);
			}
		},
		[components, handleSpecificationClick]
	);
	const handleSave = useCallback(
		(component) => {
			let newComponent = component;
			let newComponents;
			if (!component.id) {
				newComponent = {
					component: {
						...component,
					},
					order: components.length + 1,
				};
				newComponents = [...components, newComponent];
				setOpenPanel(false);
			} else {
				newComponents = components.map((c) => {
					if (c.id === component.id) {
						return { ...component };
					}
					return { ...c };
				});
			}

			setComponents(newComponents);
			handleCreateOrUpdate(newComponents, !component.id, newComponent);
			setSelectedComponent(newComponent);
		},
		[components, handleCreateOrUpdate]
	);

	const seeClickHandler = useCallback(
		(e) => {
			if (e.target.parentElement.dataset.componentId) {
				const cs = components.find(
					(c) =>
						c.component.identifiant ===
						e.target.parentElement.dataset.componentId
				);
				setSelectedComponent(cs.component);
				setOpenPanel(true);
			}
		},
		[components]
	);

	const goingUp = useCallback(
		(e) => {
			if (e.target.parentElement.dataset.componentId) {
				handleUp(e.target.parentElement.dataset.componentId);
			}
		},
		[handleUp]
	);
	const goingDown = useCallback(
		(e) => {
			if (e.target.parentElement.dataset.componentId) {
				handleDown(e.target.parentElement.dataset.componentId);
			}
		},
		[handleDown]
	);

	const handleCreateComponent = useCallback(
		(e) => {
			e.stopPropagation();
			setSelectedComponent({
				disseminationStatus: structure.disseminationStatus,
				contributor: 'DG75-H250',
			});
			setOpenPanel(true);
		},
		[structure]
	);

	const componentsWithActions = components
		.sort((cd1, cd2) => {
			const order1 = parseInt(cd1.order || '1');
			const order2 = parseInt(cd2.order || '1');
			return order1 - order2;
		})
		.map((componentDefinition, i) => {
			const component = componentDefinition.component;

			return {
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
				concept: concepts.find(
					({ id }) => id?.toString() === component.concept?.toString()
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
							title={D.see}
						>
							<span className="glyphicon glyphicon-eye-open"></span>
						</button>
						<button
							data-component-id={component.identifiant}
							onClick={specificationClickHandler}
							aria-label={D.componentSpecificationTitle}
							title={D.componentSpecificationTitle}
						>
							<span className="glyphicon glyphicon-cog"></span>
						</button>
						{!readOnly && (
							<button
								data-component-id={component.identifiant}
								onClick={removeClickHandler}
								aria-label={D.remove}
								title={D.remove}
							>
								<span className="glyphicon glyphicon-minus"></span>
							</button>
						)}
						{!readOnly && i !== 0 && (
							<button
								data-component-id={component.identifiant}
								onClick={goingUp}
								aria-label={D.up}
								title={D.up}
							>
								<span className="glyphicon glyphicon-arrow-up"></span>
							</button>
						)}
						{!readOnly && i !== components.length - 1 && (
							<button
								data-component-id={component.identifiant}
								onClick={goingDown}
								aria-label={D.down}
								title={D.down}
							>
								<span className="glyphicon glyphicon-arrow-down"></span>
							</button>
						)}
					</>
				),
			};
		});
	return (
		<CollapsiblePanel
			id="components-picker"
			hidden={hidden}
			collapsible={false}
			title={
				<>
					{D.componentTitle}{' '}
					{!readOnly && (
						<Auth roles={[ADMIN]}>
							<button
								id="add-component"
								aria-label={D.addComponentTitle}
								onClick={handleCreateComponent}
							>
								<span className="glyphicon glyphicon-plus"></span>
							</button>
						</Auth>
					)}
				</>
			}
		>
			<Table
				rowParams={defaultComponentsTableParams}
				data={componentsWithActions}
				search={false}
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
					handleSave={handleSave}
					handleBack={() => {
						setOpenPanel(false);
					}}
					readOnly={readOnly}
					structureComponents={components}
					type={type}
					stampListOptions={stampListOptions}
				/>
			</SlidingPanel>
		</CollapsiblePanel>
	);
};
