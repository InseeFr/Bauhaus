import React, { Component } from 'react';
import MSDComponent from 'js/components/operations/msd/msd';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';
import loadMetadataStructure from 'js/actions/operations/metadatastructure/list';
import loadSIMS from 'js/actions/operations/sims/item';
import { withRouter } from 'react-router-dom';
import MSDHelp from 'js/components/operations/msd/msd/visualizations/help';
import Sims from 'js/components/operations/msd/msd/visualizations/sims';
import buildExtract from 'js/utils/build-extract';
import PropTypes from 'prop-types';

const extractId = buildExtract('id');

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
	render() {
		const {
			metadataStructure,
			status,
			codesLists,
			mode = HELP,
			baseUrl,
		} = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return (
			<MSDComponent
				metadataStructure={metadataStructure}
				currentSection={this.props.match.params.idSection}
				storeCollapseState={mode === HELP}
				baseUrl={baseUrl}
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
						sims={this.props.currentSims}
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.idSection}
					/>
				)}
				{mode === CREATE && <div> CREATE mode</div>}
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
	const id = extractId(ownProps);

	return {
		metadataStructure,
		currentSims:
			ownProps.mode === VIEW ? state.operationsSimsCurrent.rubrics : {},
		id,
		codesLists: state.operationsCodesList.results,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
	loadSIMS,
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
};
