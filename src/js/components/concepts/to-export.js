import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ConceptsPicker from './picker';
import { dictionary } from 'js/utils/dictionary';
import * as select from 'js/reducers';
import { EXPORT_CONCEPT_LIST } from 'js/actions/constants';
import Loadable from 'react-loading-overlay';
import exportConceptList from 'js/actions/concepts/export-multi';
import loadConceptList from 'js/actions/concepts/list';
import { OK } from 'js/constants';

class ConceptsToExport extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exportRequested: false,
		};
		this.handleExportConceptList = ids => {
			this.props.exportConceptList(ids);
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
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.exporting}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		}

		if (!concepts) {
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.loading}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		}

		return (
			<ConceptsPicker
				concepts={concepts}
				title={dictionary.concepts.export.title}
				panelTitle={dictionary.concepts.export.panel}
				labelLoadable={dictionary.loadable.exporting}
				labelWarning={dictionary.warning.export.concepts}
				labelValidateButton={dictionary.buttons.export}
				handleAction={this.handleExportConceptList}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConceptsToExport);
