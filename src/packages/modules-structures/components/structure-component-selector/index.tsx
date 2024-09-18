import { useCallback, useState, useEffect } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { typeUriToLabel } from '../../utils';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { ComponentDetail } from '../component-detail';
import Auth from '../../../auth/components/auth';
import Representation from '../representation';
import { UNPUBLISHED } from '../../../model/ValidationState';
import { useStampsOptions } from '../../../utils/hooks/stamps';
import { ADMIN } from '../../../auth/roles';
import {
	Component,
	ComponentDefinition,
} from '../../../model/structures/Component';
import { Structure } from '../../../model/structures/Structure';
import { CodesList } from '../../../model/CodesList';
import { SeeButton } from '../../../components';
import { convertToArrayIfDefined } from '../../../utils/array-utils';
import { DataTable } from '../../../components/datatable';
import { Column } from 'primereact/column';

type StructureComponentsSelectorTypes = {
	hidden?: boolean;
	componentDefinitions: ComponentDefinition[];
	handleRemove?: (value: ComponentDefinition) => void;
	handleUp?: (value: ComponentDefinition) => void;
	handleDown?: (value: ComponentDefinition) => void;
	handleCreateOrUpdate?: any;
	handleSpecificationClick?: any;
	concepts: any;
	codesLists: any;
	readOnly: boolean;
	type?: string;
	handleCodesListDetail: any;
	structure?: Structure;
};
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
}: Readonly<StructureComponentsSelectorTypes>) => {
	const removeClickHandler = useCallback(
		(e: any) => {
			handleRemove!(e.target.parentElement.dataset.componentId);
		},
		[handleRemove]
	);
	const stampListOptions = useStampsOptions();
	const [openPanel, setOpenPanel] = useState(false);
	const [components, setComponents] = useState(defaultComponents);
	useEffect(() => {
		setComponents(defaultComponents);
	}, [defaultComponents]);

	const [selectedComponent, setSelectedComponent] = useState<any>(null);

	const specificationClickHandler = useCallback(
		(e: any) => {
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
		(component: ComponentDefinition) => {
			const generateComponentDefinitionForNewlyCreateComponent = (
				component: Component
			): ComponentDefinition => {
				return {
					component: {
						...component,
						contributor: convertToArrayIfDefined(component.contributor) ?? [],
					},
					order: components.length + 1,
				};
			};

			let newComponent = component;
			let newComponents;
			if (!component.id) {
				newComponent = generateComponentDefinitionForNewlyCreateComponent(
					component as unknown as Component
				);
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
		(e: any) => {
			if (e.target.parentElement.dataset.componentId) {
				const cs = components.find(
					(c) =>
						c.component.identifiant ===
						e.target.parentElement.dataset.componentId
				);
				setSelectedComponent(cs!.component);
				setOpenPanel(true);
			}
		},
		[components]
	);

	const goingUp = useCallback(
		(e: any) => {
			if (e.target.parentElement.dataset.componentId) {
				handleUp!(e.target.parentElement.dataset.componentId);
			}
		},
		[handleUp]
	);
	const goingDown = useCallback(
		(e: any) => {
			if (e.target.parentElement.dataset.componentId) {
				handleDown!(e.target.parentElement.dataset.componentId);
			}
		},
		[handleDown]
	);

	const handleCreateComponent = useCallback(
		(e: any) => {
			e.stopPropagation();
			setSelectedComponent({
				disseminationStatus: structure?.disseminationStatus,
				contributor: 'DG75-H250',
			});
			setOpenPanel(true);
		},
		[structure]
	);

	const componentsWithActions = components
		.sort((cd1, cd2) => {
			const order1 = parseInt(`${cd1.order}` || '1');
			const order2 = parseInt(`${cd2.order}` || '1');
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
					({ id }: any) => id?.toString() === component.concept?.toString()
				)?.label,
				representation: (
					<Representation
						component={component}
						codesLists={codesLists}
						handleCodesListDetail={() => {
							const codesList = codesLists.find(
								({ id }: CodesList) =>
									id?.toString() === component.codeList?.toString()
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
							onClick={specificationClickHandler}
							aria-label={D.componentSpecificationTitle}
							title={D.componentSpecificationTitle}
						>
							<span className="glyphicon glyphicon-cog"></span>
						</button>
						{!readOnly && (
							<button
								className="btn btn-default"
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
								className="btn btn-default"
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
								className="btn btn-default"
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
			<DataTable value={componentsWithActions} withPagination={false}>
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
