import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
import ModalRmes from 'js/components/shared/modal-rmes/modal-rmes';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { goBack } from 'js/utils/redirection';
import Button from 'js/components/shared/button';
import { getSecondLang } from 'js/reducers/app';
import Auth from 'js/utils/auth/components/auth';
import {
	INDICATOR_CREATOR,
	ADMIN,
	SERIES_CREATOR,
	CNIS,
} from 'js/utils/auth/roles';
import PageTitleBlock from 'js/components/shared/page-title-block';

const extractId = buildExtract('id');

class OperationVisualizationContainer extends Component {
	static propTypes = {
		operation: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		exportVariableBook: PropTypes.func,
		exportStatus: PropTypes.string,
		langs: PropTypes.object,
		secondLang: PropTypes.bool,
		saveSecondLang: PropTypes.func,
	};

	constructor(props) {
		super(props);

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

	componentWillMount() {
		if (!this.props.operation.id) {
			this.props.loadOperation(this.props.id);
		}
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

		if (!operation.id) return <Loading textType="loading" />;
		if (this.state.isLoading && exportStatus !== OK) {
			return <Loading textType="exporting" />;
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

				<PageTitleBlock
					titleLg1={operation.prefLabelLg1}
					titleLg2={operation.prefLabelLg2}
					secondLang={secondLang}
				/>

				<div className="row btn-line action-toolbar">
					<Button
						action={goBack(this.props, '/operations/operations')}
						label={D.btnReturn}
					/>

					<div className="empty-center" />
					{operation.idSims && (
						<Button
							action={`/operations/sims/${operation.idSims}`}
							label={D.btnSimsVisu}
						/>
					)}
					{!operation.idSims && (
						<Auth roles={[ADMIN, SERIES_CREATOR, INDICATOR_CREATOR]}>
							<div className="col-md-6 centered" />
							<Button
								action={`/operations/operation/${operation.id}/sims/create`}
								label={D.btnSimsCreate}
							/>
						</Auth>
					)}
					<Auth roles={[ADMIN, SERIES_CREATOR, CNIS]}>
						<Button label={D.btnValid} />
					</Auth>
					<Auth roles={[ADMIN, SERIES_CREATOR, CNIS]}>
						<Button
							action={`/operations/operation/${operation.id}/modify`}
							label={D.btnUpdate}
						/>
					</Auth>
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

export const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const operation = select.getOperation(state);
	return {
		id,
		operation: id === operation.id ? operation : {},
		exportStatus: select.getStatus(state, EXPORT_VARBOOK),
		langs: select.getLangs(state),
		secondLang: getSecondLang(state),
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
