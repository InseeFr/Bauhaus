import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as select from 'js/reducers';
import { EXPORT_VARBOOK } from 'js/actions/constants';
import { OK } from 'js/constants';
import Loading from 'js/components/shared/loading';
import OperationsOperationVisualization from './home';
import buildExtract from 'js/utils/build-extract';
import exportVariableBook from 'js/actions/operations/export-varBook';
import { saveSecondLang } from 'js/actions/app';
import loadOperation from 'js/actions/operations/operations/item';
import D from 'js/i18n';
import ModalRmes from 'js/components/shared/modal-rmes';
import PageTitle from 'js/components/shared/page-title';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageSubtitle from 'js/components/shared/page-subtitle';
import { goBack } from 'js/utils/redirection';
import Button from 'js/components/shared/button';

const extractId = buildExtract('id');

class OperationVisualizationContainer extends Component {
	componentWillMount() {
		if (!this.props.operation.id) {
			this.props.loadOperation(this.props.id);
		}
	}
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
		const {
			id,
			exportStatus,
			operation,
			langs,
			secondLang,
			saveSecondLang,
		} = this.props;

		if (!operation.id)
			return <Loading textType="loading" context="operations" />;
		if (this.state.isLoading && exportStatus !== OK) {
			return <Loading textType="exporting" context="operations" />;
		}

		const modalButtons = [
			{
				label: D.btnCancel,
				action: this.closeModal,
				style: 'primary',
			},
			{
				label: D.btnValid,
				action: () =>
					this.handleBookRequest(id, 'application/vnd.oasis.opendocument.text'),
				style: 'primary',
			},
		];

		return (
			<div className="container">
				<CheckSecondLang secondLang={secondLang} onChange={saveSecondLang} />

				<ModalRmes
					id="modal"
					isOpen={this.state.isModalOpen}
					title="Choix du type d'export du dictionnaire de variables"
					body="TODO"
					closeCancel={this.closeModal}
					modalButtons={modalButtons}
				/>

				<PageTitle title={operation.prefLabelLg1} context="operations" />
				{secondLang &&
					operation.prefLabelLg2 && (
						<PageSubtitle
							subTitle={operation.prefLabelLg2}
							context="operations"
						/>
					)}

				<div className="row btn-line">
					<Button
						action={goBack(this.props, '/operations/operations')}
						label={D.btnReturn}
						context="operations"
					/>

					<div className="col-md-4 centered" />

					{operation.idSims && (
						<Button
							action={`/operations/sims/${operation.idSims}`}
							label={D.btnSimsVisu}
							context="operations"
						/>
					)}
					{!operation.idSims && (
						<Button
							action={`/operations/${operation.id}/sims/create`}
							label={D.btnSimsCreate}
							context="operations"
						/>
					)}
					<Button label={D.btnSend} context="operations" />
					<Button
						action={`/operations/operation/${operation.id}/modify`}
						label={D.btnUpdate}
						context="operations"
					/>
				</div>
				<OperationsOperationVisualization
					id={id}
					isModalOpen={this.state.isModalOpen}
					openModal={this.openModal}
					attr={operation}
					langs={langs}
					secondLang={secondLang}
					saveSecondLang={saveSecondLang}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = select.getOperation(state, id);
	return {
		id,
		operation: id === operation.id ? operation : {},
		exportStatus: select.getStatus(state, EXPORT_VARBOOK),
		langs: select.getLangs(state),
		secondLang: state.app.secondLang,
	};
};

const mapDispatchToProps = {
	exportVariableBook,
	saveSecondLang,
	loadOperation,
};

OperationVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(OperationVisualizationContainer);

export default withRouter(OperationVisualizationContainer);
