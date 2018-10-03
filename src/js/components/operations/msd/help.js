import React, { Component } from 'react';
import MSDComponent from 'js/components/operations/msd/msd';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';
import loadMetadataStructure from 'js/actions/operations/metadatastructure/list';
import { withRouter } from 'react-router-dom';
import MSDHelp from 'js/components/operations/msd/msd/visualizations/help';
import PropTypes from 'prop-types';

export const HELP = 'HELP';
export const CREATE = 'CREATE';
export const VIEW = 'VIEW';

class MSDContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadMetadataStructure();
		}
	}
	render() {
		const { metadataStructure, status, codesLists, mode = HELP } = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return (
			<MSDComponent
				metadataStructure={metadataStructure}
				currentSection={this.props.match.params.id}
				storeCollapseState={mode === HELP}
			>
				{mode === HELP && (
					<MSDHelp
						metadataStructure={metadataStructure}
						codesLists={codesLists}
						currentSection={this.props.match.params.id}
					/>
				)}

				{mode === VIEW && <div> VIEW mode</div>}
				{mode === CREATE && <div> CREATE mode</div>}
			</MSDComponent>
		);
	}
}

const mapStateToProps = state => {
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
		metadataStructure,
		codesLists: state.operationsCodesList.results,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadMetadataStructure,
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
};
