import React, { Component } from 'react';
import MSDComponent from 'js/components/operations/msd/msd';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';
import loadMetadataStructure from 'js/actions/operations/metadatastructure/list';
import loadSIMS, { saveSims } from 'js/actions/operations/sims/item';
import { withRouter } from 'react-router-dom';
import MSDHelp from 'js/components/operations/msd/msd/visualizations/help';
import Sims from 'js/components/operations/msd/msd/visualizations/sims';
import SimsForm from 'js/components/operations/msd/msd/visualizations/sims-form';
import buildExtract from 'js/utils/build-extract';
import PropTypes from 'prop-types';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers';

const extractId = buildExtract('id');
const extractIdOperation = buildExtract('idOperation');

export const HELP = 'HELP';
export const CREATE = 'CREATE';
export const VIEW = 'VIEW';

class MSDContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadMetadataStructure();
			this.props.mode === VIEW && this.props.loadSIMS(this.props.id);
		}
	}
	componentWillReceiveProps(nextProps) {
		// If we do a redirect form the Edit to the view mode, we must reload the sims data from the server
		if (
			nextProps.mode === VIEW &&
			nextProps.id !== this.props.id &&
			nextProps.id
		) {
			this.props.loadSIMS(nextProps.id);
		}
	}
	render() {
		const {
			metadataStructure,
			status,
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
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		if (mode === VIEW && !currentSims.id)
			return <Loading textType="loading" context="operations" />;
		return (
			<MSDComponent
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
					<Sims
						sims={currentSims.rubrics}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
					/>
				)}
				{mode === CREATE && (
					<SimsForm
						sims={currentSims.rubrics}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
						onSubmit={saveSims}
						idOperation={idOperation}
						saveSecondLang={saveSecondLang}
						langs={langs}
						secondLang={secondLang}
					/>
				)}
			</MSDComponent>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	if (!state.operationsMetadataStructureList) {
		return {
			status: NOT_LOADED,
			metadataStructure: [],
		};
	}
	const {
		results: metadataStructure,
		status,
		err,
	} = state.operationsMetadataStructureList;

	return {
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
		metadataStructure,
		currentSims: ownProps.mode === VIEW ? state.operationsSimsCurrent : {},
		id: extractId(ownProps),
		idOperation: extractIdOperation(ownProps),
		codesLists: state.operationsCodesList.results,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
	loadSIMS,
	saveSims,
	saveSecondLang,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(MSDContainer)
);

MSDContainer.propTypes = {
	metadataStructure: PropTypes.object,
	status: PropTypes.oneOf([LOADED, NOT_LOADED, LOADING]),
	codesLists: PropTypes.object,
	mode: PropTypes.oneOf([HELP, VIEW, CREATE]),
	baseUrl: PropTypes.string,
	disableSectionAnchor: PropTypes.bool,
};
MSDContainer.defaultProps = {
	currentSims: {},
};
