import { Component as ReactComponent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { D1, D2 } from '../../deprecated-locales';
import MSDLayout from '../../modules-operations/msd/layout/';
import loadMetadataStructure from '../../redux/operations/metadatastructure/list';
import { LOADED, NOT_LOADED } from '../../sdk/constants';

import MSDHelp from '../../modules-operations/msd/pages/help';
import SimsCreation from '../../modules-operations/msd/pages/sims-creation/';
import SimsVisualisation from '../../modules-operations/msd/pages/sims-visualisation/';
import loadSIMS, {
	publishSims,
	saveSims,
} from '../../redux/actions/operations/sims/item';
import { getOperationsCodesList } from '../../redux/operations/selector';

import { useLoaderData, useParams } from 'react-router-dom';
import { getOperationsSimsCurrent } from '../../redux/selectors';
import { OperationsApi } from '../../sdk/operations-api';
import { useOrganizations } from '../../utils/hooks/organizations';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { SimsContextProvider } from './context';
import './msd.scss';
import { DocumentsStoreProvider } from './pages/sims-creation/documents-store-context';
import { isEssentialRubricKo } from './sims-field-title';
import { getParentId, getParentType } from './utils';
import { useDocumentsList } from './pages/sims-creation/useDocumentsList';
import { isLoaded, loadGeographies } from '../../redux/geographies.action';
import { CREATE, DUPLICATE, HELP, UPDATE, VIEW } from './constant';
import { Loading } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
class MSDContainer extends ReactComponent {
	static defaultProps = {
		currentSims: {},
	};

	constructor() {
		super();
		this.state = {
			exportPending: false,
			owners: [],
			defaultSims: {},
			missingDocuments: new Set(),
		};
	}

	componentDidMount() {
		if (this.props.metadataStructureStatus !== LOADED) {
			this.props.loadMetadataStructure();
		}
		if (
			(this.props.mode === UPDATE || this.props.mode === VIEW) &&
			!this.props.currentSims.id
		) {
			this.props.loadSIMS(this.props.id);
		}

		if (!this.props.geographiesLoaded) {
			this.props.loadGeographies();
		}

		this._loadOwnersList(this.props.id);
	}

	_loadOwnersList(id) {
		if (id) {
			OperationsApi.getOwners(id).then((owners) => {
				this.setState({ owners });
			});
		}
	}
	exportCallback = (id, config, sims) => {
		this.setState(() => ({ exportPending: true, missingDocuments: new Set() }));
		OperationsApi.exportSims(id, config, sims).then((missingDocuments) => {
			this.setState(() => ({ exportPending: false, missingDocuments }));
		});
	};

	componentWillReceiveProps(nextProps) {
		if (!nextProps.currentSims.id || this.props.id !== nextProps.id) {
			this.props.loadSIMS(nextProps.id);
		}
		if (this.props.mode === CREATE && nextProps.mode === VIEW) {
			this._loadOwnersList(nextProps.id);
		}
	}
	isEditMode = () => {
		const { mode } = this.props;
		return mode === CREATE || mode === UPDATE || mode === DUPLICATE;
	};
	render() {
		const {
			metadataStructure,
			metadataStructureStatus,
			codesLists,
			mode = HELP,
			baseUrl,
			saveSims,
			idParent,
			disableSectionAnchor,
			currentSims,
			organisations,
			parentType,
			parent,
			goBack,
		} = this.props;

		if (
			metadataStructureStatus !== LOADED ||
			((mode === VIEW || mode === UPDATE) && !currentSims.id)
		)
			return <Loading />;

		if (this.state.exportPending) return <Loading />;

		let essentialRubricContext = {};
		if (mode === VIEW || this.isEditMode()) {
			const makeMetadatastructureFlat = (items) => {
				if (!items || items.length === 0) {
					return items;
				}
				return [
					...items,
					...makeMetadatastructureFlat(
						items.map((item) => Object.values(item.children)).flat(),
					),
				];
			};
			const flatMetadataStructure = makeMetadatastructureFlat(
				Object.values(metadataStructure),
			);

			essentialRubricContext = flatMetadataStructure.reduce((acc, msd) => {
				if (msd.minOccurs === '1') {
					msd.essentialRubricKoLg1 = isEssentialRubricKo(
						msd,
						currentSims.rubrics?.[msd.idMas],
						false,
					);
					msd.essentialRubricKoLg2 = isEssentialRubricKo(
						msd,
						currentSims.rubrics?.[msd.idMas],
						true,
					);
				}
				return {
					...acc,
					[msd.idMas]: {
						...msd,
					},
				};
			}, {});
		}
		return (
			<MSDLayout
				metadataStructure={metadataStructure}
				storeCollapseState={mode === HELP}
				baseUrl={baseUrl}
				disableSectionAnchor={disableSectionAnchor}
			>
				{mode !== HELP && mode !== DUPLICATE && (
					<PageTitleBlock
						titleLg1={currentSims.labelLg1}
						titleLg2={currentSims.labelLg2}
					/>
				)}
				{mode === HELP && (
					<MSDHelp
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						organisations={organisations}
					/>
				)}

				{mode === VIEW && (
					<SimsContextProvider value={essentialRubricContext}>
						<SimsVisualisation
							sims={currentSims}
							metadataStructure={metadataStructure}
							codesLists={codesLists}
							organisations={organisations}
							publishSims={this.props.publishSims}
							exportCallback={this.exportCallback}
							missingDocuments={this.state.missingDocuments}
							owners={this.state.owners}
						/>
					</SimsContextProvider>
				)}
				{this.isEditMode() && (
					<SimsContextProvider value={essentialRubricContext}>
						<SimsCreation
							parent={parent}
							sims={currentSims}
							metadataStructure={metadataStructure}
							codesLists={codesLists}
							onSubmit={saveSims}
							idParent={idParent}
							goBack={goBack}
							mode={mode}
							organisations={organisations}
							parentType={parentType}
							defaultSimsRubrics={this.state.defaultSimsRubrics}
						/>
					</SimsContextProvider>
				)}
			</MSDLayout>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	if (!state.operationsMetadataStructureList) {
		return {
			metadataStructureStatus: NOT_LOADED,
			metadataStructure: [],
		};
	}

	const { results: metadataStructure, status: metadataStructureStatus } =
		state.operationsMetadataStructureList;

	const id = ownProps.params.id;

	let idParent;
	let currentSims = {};
	let parentType;
	switch (ownProps.mode) {
		case HELP:
			currentSims = {};
			break;
		case CREATE:
			parentType = ownProps.parentType;
			idParent = ownProps.params.idParent;
			break;
		default:
			currentSims = getOperationsSimsCurrent(state);
			parentType = getParentType(currentSims);
			idParent = getParentId(currentSims);
			break;
	}

	return {
		geographiesLoaded: isLoaded(state),
		metadataStructure,
		metadataStructureStatus,
		currentSims: !id || currentSims.id === id ? currentSims : {},
		id,
		idParent,
		codesLists: getOperationsCodesList(state),
		parentType,
	};
};

const mapDispatchToProps = {
	loadGeographies,
	loadMetadataStructure,
	loadSIMS,
	saveSims,
	publishSims,
};

const MSDContainerWithParent = (props) => {
	const { data: organisations } = useOrganizations();
	const { idParent, parentType } = props;
	const [parent, setParent] = useState(props.parent);
	const [loading, setLoading] = useState(true);
	const { documentStores, setDocumentStores } = useDocumentsList();
	const [rubricIdForNewDocument, setRubricIdForNewDocument] = useState();
	const goBack = useGoBack();

	const currentSims =
		props.mode === CREATE
			? {
					labelLg1: D1.simsTitle + parent?.prefLabelLg1,
					labelLg2: D2.simsTitle + parent?.prefLabelLg2,
				}
			: props.currentSims;

	useEffect(() => {
		// TO BE REMOVED when all cache will be deleted
		if (parentType === 'indicator') {
			OperationsApi.getIndicatorById(idParent)
				.then((payload) => setParent(payload))
				.finally(() => setLoading(false));
		} else if (parentType === 'operation') {
			OperationsApi.getOperation(idParent)
				.then((payload) => setParent(payload))
				.finally(() => setLoading(false));
		} else if (parentType === 'series') {
			OperationsApi.getSerie(idParent)
				.then((payload) => setParent(payload))
				.finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, [idParent, parentType]);

	const [lateralPanelOpened, setLateralPanelOpened] = useState();

	if (loading) return <Loading />;

	return (
		<DocumentsStoreProvider
			value={{
				documentStores,
				updateDocumentStores: setDocumentStores,
				lateralPanelOpened,
				onLateralPanelHide: () => setLateralPanelOpened(undefined),
				openLateralPanelOpened: (type) => setLateralPanelOpened(type),
				rubricIdForNewDocument,
				setRubricIdForNewDocument,
			}}
		>
			<MSDContainer
				{...props}
				organisations={organisations}
				currentSims={currentSims}
				parent={parent}
				goBack={goBack}
			/>
		</DocumentsStoreProvider>
	);
};
const withParams = (Component) => {
	return (props) => {
		const params = useParams();
		const { baseUrl, mode, disableSectionAnchor, parentType } = useLoaderData();
		return (
			<Component
				{...props}
				mode={mode}
				disableSectionAnchor={disableSectionAnchor}
				parentType={parentType}
				params={params}
				baseUrl={baseUrl}
			/>
		);
	};
};
export const Component = withParams(
	connect(mapStateToProps, mapDispatchToProps)(MSDContainerWithParent),
);
