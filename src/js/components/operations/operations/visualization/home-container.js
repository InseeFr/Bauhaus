import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_VARBOOK } from 'js/actions/constants';
import { OK } from 'js/constants';

import Loading from 'js/components/shared/loading';
import OperationVisualization from './home';

import buildExtract from 'js/utils/build-extract';
import exportVariableBook from 'js/actions/operations/export-varBook';

//import '../operations.css';

const extractId = buildExtract('id');

class OperationVisualizationContainer extends Component {
	constructor(props) {
		super();

		this.state = {
			isModalOpen: false,
			isLoading: false,
		};

		this.closeModal = () => {
			this.setState({
				isModalOpen: false,
			});
		};

		this.openModal = () => {
			this.setState({
				isModalOpen: true,
			});
		};

		this.handleBookRequest = (id, MimeType) => {
			this.props.exportVariableBook(
				'483cb18f-52da-4b7c-b522-7aabbd067666',
				MimeType
			);
			this.setState({
				isLoading: true,
				isModalOpen: false,
			});
		};
	}
	render() {
		const { id, exportStatus } = this.props;
		if (this.state.isLoading && exportStatus !== OK) {
			return <Loading textType="exporting" context="operations" />;
		}
		return (
			<OperationVisualization
				id={id}
				exportVarBook={
					() =>
						this.handleBookRequest(
							id,
							'application/vnd.oasis.opendocument.text'
						)

					//application/octet-stream
				}
				isModalOpen={this.state.isModalOpen}
				openModal={this.openModal}
				closeModal={this.closeModal}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => ({
	id: extractId(ownProps),
	exportStatus: select.getStatus(state, EXPORT_VARBOOK),
});

const mapDispatchToProps = {
	exportVariableBook,
};

OperationVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	OperationVisualizationContainer
);

export default withRouter(OperationVisualizationContainer);
