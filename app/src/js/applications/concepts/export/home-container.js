import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import ConceptsToExport from './home';
import { Loading } from '@inseefr/ui';
import exportConceptList from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';
import { OK } from 'js/constants';

class ConceptsToExportContainer extends Component {
	constructor() {
		super();
		this.state = {
			exportRequested: false,
		};
		this.handleExportConceptList = (ids, MimeType) => {
			this.props.exportConceptList(ids, MimeType);
			this.setState({
				exportRequested: true,
			});
		};
	}

	componentWillMount() {
		if (!this.props.concepts) this.props.loadConceptList();
	}

	render() {
		const { concepts, exportStatus } = this.props;
		const { exportRequested } = this.state;
		if (exportRequested) {
			if (exportStatus === OK) {
				return <Redirect to="/concepts" />;
			}
			return <Loading textType="exporting" />;
		}

		if (!concepts) {
			return <Loading />;
		}
		return (
			<ConceptsToExport
				concepts={concepts}
				handleExportConceptList={this.handleExportConceptList}
			/>
		);
	}
}

const mapStateToProps = state => ({
	concepts: select.getConceptList(state),
	exportStatus: select.getStatus(state, EXPORT_CONCEPT_LIST),
});

const mapDispatchToProps = {
	loadConceptList,
	exportConceptList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ConceptsToExportContainer);
