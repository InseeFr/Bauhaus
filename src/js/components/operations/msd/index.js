import React, { Component } from 'react';
import MSDLayout from 'js/components/operations/msd/layout/';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';
import loadMetadataStructure from 'js/actions/operations/metadatastructure/list';
import loadSIMS, { saveSims } from 'js/actions/operations/sims/item';
import { withRouter } from 'react-router-dom';
import MSDHelp from 'js/components/operations/msd/pages/help';
import SimsVisualisation from 'js/components/operations/msd/pages/sims-visualisation/';
import SimsCreation from 'js/components/operations/msd/pages/sims-creation/';
import buildExtract from 'js/utils/build-extract';
import PropTypes from 'prop-types';
import { saveSecondLang } from 'js/actions/app';
import { compose } from 'recompose';
import * as select from 'js/reducers';

const extractId = buildExtract('id');
const extractIdOperation = buildExtract('idOperation');

export const HELP = 'HELP';
export const CREATE = 'CREATE';
export const VIEW = 'VIEW';
export const UPDATE = 'UPDATE';

class MSDContainer extends Component {
	static propTypes = {
		metadataStructure: PropTypes.object,
		metadataStructureStatus: PropTypes.oneOf([LOADED, NOT_LOADED, LOADING]),
		codesLists: PropTypes.object,
		mode: PropTypes.oneOf([HELP, VIEW, CREATE, UPDATE]),
		baseUrl: PropTypes.string,
		id: PropTypes.string,
		saveSims: PropTypes.func,
		idOperation: PropTypes.string,
		disableSectionAnchor: PropTypes.bool,
		saveSecondLang: PropTypes.func,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
		currentSims: PropTypes.object,
	};
	static defaultProps = {
		currentSims: {},
	};

	constructor(props) {
		super(props);
		this.goBackCallback = this.goBackCallback.bind(this);
	}

	goBackCallback(url) {
		this.props.history.push(url);
	}

	componentWillMount() {
		if (this.props.metadataStructureStatus !== LOADED) {
			this.props.loadMetadataStructure();
		}
		if (!this.props.currentSims.id) {
			this.props.loadSIMS(this.props.id);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (!nextProps.currentSims.id || this.props.id !== nextProps.id) {
			this.props.loadSIMS(nextProps.id);
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
			idOperation,
			disableSectionAnchor,
			saveSecondLang,
			langs,
			secondLang,
			currentSims,
		} = this.props;

		console.log(metadataStructureStatus);
		if (
			metadataStructureStatus !== LOADED ||
			(mode === VIEW && !currentSims.id)
		)
			return <Loading textType="loading" context="operations" />;
		return (
			<MSDLayout
				metadataStructure={metadataStructure}
				currentSection={this.props.match.params.idSection}
				storeCollapseState={mode === HELP}
				baseUrl={baseUrl}
				disableSectionAnchor={disableSectionAnchor}
			>
				{mode === HELP && (
					<MSDHelp
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
					/>
				)}

				{mode === VIEW && (
					<SimsVisualisation
						sims={currentSims}
						idOperation={currentSims.idOperation}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
						goBack={this.goBackCallback}
					/>
				)}
				{(mode === CREATE || mode === UPDATE) && (
					<SimsCreation
						sims={currentSims}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						onSubmit={saveSims}
						idOperation={idOperation}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
						goBack={this.goBackCallback}
					/>
				)}
			</MSDLayout>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	if (!state.operationsMetadataStructureList) {
		return {
			metadataStructureStatus: NOT_LOADED,
			metadataStructure: [],
		};
	}
	const {
		results: metadataStructure,
		status: metadataStructureStatus,
		err,
	} = state.operationsMetadataStructureList;

	const currentSims =
		ownProps.mode === HELP ? {} : select.getOperationsSimsCurrent(state);
	const id = extractId(ownProps);
	return {
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
		metadataStructure,
		currentSims: currentSims.id === id ? currentSims : {},
		id,
		idOperation: extractIdOperation(ownProps),
		codesLists: state.operationsCodesList.results,
		metadataStructureStatus,
		err,
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
	loadSIMS,
	saveSims,
	saveSecondLang,
};

export default compose(
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(MSDContainer);
