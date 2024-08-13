import { Component, useEffect, useState } from 'react';
import MSDLayout from '../../../applications/operations/msd/layout/';
import { connect } from 'react-redux';
import { Loading, PageTitleBlock } from '../../../new-architecture/components';
import { NOT_LOADED, LOADED } from '../../../new-architecture/sdk/constants';
import loadMetadataStructure from '../../../new-architecture/redux/operations/metadatastructure/list';
import { D1, D2 } from '../../../i18n';
import {
	getOperationsOrganisations,
	getOperationsCodesList,
} from '../../../new-architecture/redux/operations/selector';
import loadSIMS, {
	saveSims,
	publishSims,
} from '../../../new-architecture/redux/actions/operations/sims/item';
import { useHistory, useParams } from 'react-router-dom';
import MSDHelp from '../../../applications/operations/msd/pages/help';
import SimsVisualisation from '../../../applications/operations/msd/pages/sims-visualisation/';
import SimsCreation from '../../../applications/operations/msd/pages/sims-creation/';
import { ArrayUtils } from '../../../utils';
import './msd.scss';
import { isEssentialRubricKo } from './sims-field-title';
import { SimsContextProvider } from './context';
import { useGoBack } from '../../../new-architecture/utils/hooks/useGoBack';
import {
	getLocales,
	getOperationsSimsCurrent,
} from '../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../new-architecture/redux/second-lang';
import {
	isLoaded,
	loadGeographies,
} from '../../../new-architecture/redux/geographies.action';
import { GeneralApi } from '../../../new-architecture/sdk/general-api';
import { OperationsApi } from '../../../new-architecture/sdk/operations-api';

export const HELP = 'HELP';
export const CREATE = 'CREATE';
export const VIEW = 'VIEW';
export const UPDATE = 'UPDATE';
export const DUPLICATE = 'DUPLICATE';

const sortByLabel = ArrayUtils.sortArray('labelLg1');

class MSDContainer extends Component {
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
			this.props.loadSIMS(this.props.params.id);
		}

		if (!this.props.geographiesLoaded) {
			this.props.loadGeographies();
		}

		this._loadOwnersList(this.props.params.id);
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
		if (!nextProps.currentSims.id || this.props.params.id !== nextProps.id) {
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
			disableSectionAnchor,
			langs,
			secondLang,
			currentSims,
			organisations,
			parent,
			documentStores,
			goBack,
			params,
			history,
		} = this.props;

		if (
			metadataStructureStatus !== LOADED ||
			((mode === VIEW || mode === UPDATE) && !currentSims.id)
		)
			return <Loading />;

		if (this.state.exportPending) return <Loading textType="loadableLoading" />;

		let essentialRubricContext = {};
		if (mode === VIEW || this.isEditMode()) {
			const makeMetadatastructureFlat = (items) => {
				if (!items || items.length === 0) {
					return items;
				}
				return [
					...items,
					...makeMetadatastructureFlat(
						items.map((item) => Object.values(item.children)).flat()
					),
				];
			};
			const flatMetadataStructure = makeMetadatastructureFlat(
				Object.values(metadataStructure)
			);

			essentialRubricContext = flatMetadataStructure.reduce((acc, msd) => {
				if (msd.minOccurs === '1') {
					msd.essentialRubricKoLg1 = isEssentialRubricKo(
						msd,
						currentSims.rubrics?.[msd.idMas],
						false
					);
					msd.essentialRubricKoLg2 = isEssentialRubricKo(
						msd,
						currentSims.rubrics?.[msd.idMas],
						true
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
				currentSection={params.idSection}
				storeCollapseState={mode === HELP}
				baseUrl={baseUrl}
				disableSectionAnchor={disableSectionAnchor}
			>
				{mode !== HELP && mode !== DUPLICATE && (
					<PageTitleBlock
						titleLg1={currentSims.labelLg1}
						titleLg2={currentSims.labelLg2}
						secondLang={secondLang || mode !== VIEW}
					/>
				)}
				{mode === HELP && (
					<MSDHelp
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={params.idSection}
						langs={langs}
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
							currentSection={params.idSection}
							langs={langs}
							secondLang={secondLang}
							goBack={goBack}
							publishSims={this.props.publishSims}
							exportCallback={this.exportCallback}
							missingDocuments={this.state.missingDocuments}
							documentStores={documentStores}
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
							idParent={params.idParent}
							langs={langs}
							goBack={goBack}
							mode={mode}
							organisations={organisations}
							parentType={params[0]}
							documentStores={documentStores}
							defaultSimsRubrics={this.state.defaultSimsRubrics}
							history={history}
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

	let currentSims = {};
	switch (ownProps.mode) {
		case HELP:
			currentSims = {};
			break;
		default:
			currentSims = getOperationsSimsCurrent(state);
			break;
	}

	return {
		geographiesLoaded: isLoaded(state),
		langs: getLocales(state),
		secondLang: getSecondLang(state),
		metadataStructure,
		metadataStructureStatus,
		currentSims: currentSims || {},
		codesLists: getOperationsCodesList(state),
		organisations: getOperationsOrganisations(state),
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
	loadSIMS,
	saveSims,
	publishSims,
	loadGeographies: loadGeographies,
};

const MSDContainerWithParent = (props) => {
	const params = useParams();
	const parentType = params[0];
	const idParent = params.idParent;
	const [parent, setParent] = useState(props.parent);
	const [loading, setLoading] = useState(true);
	const [documentStores, setDocumentStores] = useState([]);

	const goBack = useGoBack();
	const history = useHistory();

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

	useEffect(() => {
		GeneralApi.getDocumentsList().then((results) => {
			setDocumentStores(
				sortByLabel(
					results.map((document) => {
						return {
							...document,
							id: document.uri.substr(document.uri.lastIndexOf('/') + 1),
						};
					})
				)
			);
		});
	}, []);
	if (loading) return <Loading textType="loadableLoading" />;
	return (
		<MSDContainer
			{...props}
			documentStores={documentStores}
			currentSims={currentSims}
			parent={parent}
			goBack={goBack}
			params={params}
			history={history}
		/>
	);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MSDContainerWithParent);
