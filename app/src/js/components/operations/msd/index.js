import React, { Component } from 'react';
import MSDLayout from 'js/components/operations/msd/layout/';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';
import loadMetadataStructure from 'js/actions/operations/metadatastructure/list';
import loadSIMS, {
	saveSims,
	publishSims,
} from 'js/actions/operations/sims/item';
import { withRouter } from 'react-router-dom';
import MSDHelp from 'js/components/operations/msd/pages/help';
import SimsVisualisation from 'js/components/operations/msd/pages/sims-visualisation/';
import SimsCreation from 'js/components/operations/msd/pages/sims-creation/';
import buildExtract from 'js/utils/build-extract';
import { getLabelsFromParent } from 'js/utils/msd';
import PropTypes from 'prop-types';
import { saveSecondLang } from 'js/actions/app';
import { compose } from 'recompose';
import * as select from 'js/reducers';
import loadOperation from 'js/actions/operations/operations/item';
import loadSerie from 'js/actions/operations/series/item';
import loadIndicator from 'js/actions/operations/indicators/item';

import { getSecondLang } from 'js/reducers/app';
import {
	getOperationsOrganisations,
	getOperationsCodesList,
} from 'js/reducers/operations/selector';
import { getParentType, getParentId } from './utils';
import PageTitleBlock from 'js/components/shared/page-title-block';
const extractId = buildExtract('id');
const extractIdParent = buildExtract('idParent');

export const HELP = 'HELP';
export const CREATE = 'CREATE';
export const VIEW = 'VIEW';
export const UPDATE = 'UPDATE';
export const DUPLICATE = 'DUPLICATE';

const mapToParentType = {
	operation: {
		load: 'loadOperation',
	},
	series: { load: 'loadSerie' },
	indicator: { load: 'loadIndicator' },
};
class MSDContainer extends Component {
	static propTypes = {
		metadataStructure: PropTypes.object,
		metadataStructureStatus: PropTypes.oneOf([LOADED, NOT_LOADED, LOADING]),
		codesLists: PropTypes.object,
		mode: PropTypes.oneOf([HELP, VIEW, CREATE, UPDATE, DUPLICATE]),
		baseUrl: PropTypes.string,
		id: PropTypes.string,
		saveSims: PropTypes.func,
		idParent: PropTypes.string,
		disableSectionAnchor: PropTypes.bool,
		saveSecondLang: PropTypes.func,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
		currentSims: PropTypes.object,
	};
	static defaultProps = {
		currentSims: {},
	};

	_loadParent(id) {
		const parentType = this.props.match.params[0];
		return this.props[mapToParentType[parentType].load](id);
	}

	goBackCallback = url => {
		this.props.history.push(url);
	};

	componentDidMount() {
		if (this.props.metadataStructureStatus !== LOADED) {
			this.props.loadMetadataStructure();
		}
		if (!this.props.currentSims.id) {
			this.props.loadSIMS(this.props.id);
		}
		if (!this.props.isParentLoaded) {
			this._loadParent(this.props.idParent);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.currentSims.id || this.props.id !== nextProps.id) {
			this.props.loadSIMS(nextProps.id);
		}
		if (!nextProps.isParentLoaded) {
			this._loadParent(nextProps.idParent);
		}
	}
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
			saveSecondLang,
			langs,
			secondLang,
			currentSims,
			organisations,
			parentType,
		} = this.props;
		if (
			metadataStructureStatus !== LOADED ||
			(mode === VIEW && !currentSims.id)
		)
			return <Loading textType="loading" />;

		return (
			<MSDLayout
				metadataStructure={metadataStructure}
				currentSection={this.props.match.params.idSection}
				storeCollapseState={mode === HELP}
				baseUrl={baseUrl}
				disableSectionAnchor={disableSectionAnchor}
			>
				{mode !== HELP && mode !== DUPLICATE && (
					<PageTitleBlock
						titleLg1={currentSims.labelLg1}
						titleLg2={currentSims.labelLg2}
						secondLang={secondLang}
					/>
				)}
				{mode === HELP && (
					<MSDHelp
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
						langs={langs}
						organisations={organisations}
					/>
				)}

				{mode === VIEW && (
					<SimsVisualisation
						sims={currentSims}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						organisations={organisations}
						currentSection={this.props.match.params.idSection}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
						goBack={this.goBackCallback}
						publishSims={this.props.publishSims}
					/>
				)}
				{(mode === CREATE || mode === UPDATE || mode === DUPLICATE) && (
					<SimsCreation
						sims={currentSims}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						onSubmit={saveSims}
						idParent={idParent}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
						goBack={this.goBackCallback}
						mode={mode}
						organisations={organisations}
						parentType={parentType}
					/>
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

	const {
		results: metadataStructure,
		status: metadataStructureStatus,
	} = state.operationsMetadataStructureList;

	const id = extractId(ownProps);

	function getCurrentParent(parentType) {
		if (parentType === 'operation') {
			return [
				select.getOperation(state),
				state.operationsIndicatorCurrentStatus,
			];
		}
		if (parentType === 'series') {
			return [select.getSerie(state), state.operationsSeriesCurrentStatus];
		}
		if (parentType === 'indicator') {
			return [
				select.getIndicator(state),
				state.operationsIndicatorCurrentStatus,
			];
		}
	}

	let idParent;
	let currentSims = {};
	let parentType;
	let isParentLoaded = true;
	switch (ownProps.mode) {
		case HELP:
			currentSims = {};
			break;
		case CREATE:
			idParent = extractIdParent(ownProps);
			parentType = ownProps.match.params[0];
			const [currentParent, currentParentStatus] = getCurrentParent(parentType);
			currentSims = {
				...getLabelsFromParent(currentParent, parentType),
			};
			isParentLoaded =
				currentParentStatus !== NOT_LOADED || currentParent.id === idParent;
			break;
		default:
			currentSims = select.getOperationsSimsCurrent(state);
			parentType = getParentType(currentSims);
			idParent = getParentId(currentSims);
			break;
	}

	return {
		langs: select.getLangs(state),
		secondLang: getSecondLang(state),
		metadataStructure,
		metadataStructureStatus,
		currentSims: !id || currentSims.id === id ? currentSims : {},
		isParentLoaded,
		id,
		idParent,
		codesLists: getOperationsCodesList(state),
		organisations: getOperationsOrganisations(state),
		parentType,
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
	loadSIMS,
	saveSims,
	loadOperation,
	loadSerie,
	loadIndicator,
	saveSecondLang,
	publishSims,
};

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(MSDContainer);
