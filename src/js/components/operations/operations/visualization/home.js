import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import Controls from './controls';
import ModalRmes from 'js/components/shared/modal-rmes';
import D from 'js/i18n';

class OperationVisualization extends Component {
	render() {
		const {
			id,
			exportVarBook,
			isModalOpen,
			openModal,
			closeModal,
		} = this.props;
		const modalButtons = [
			{
				label: D.btnCancel,
				action: closeModal,
				style: 'primary',
			},
			{
				label: D.btnValid,
				action: exportVarBook,
				style: 'primary',
			},
		];

		return (
			<div className="container">
				<PageTitle title={id} context="operations" />
				<Controls openModal={openModal} />
				<ModalRmes
					id="modal"
					isOpen={isModalOpen}
					title="Choix du type d'export du dictionnaire de variables"
					body="TODO"
					closeCancel={closeModal}
					modalButtons={modalButtons}
				/>
			</div>
		);
	}
}

OperationVisualization.propTypes = {
	exportVarBook: PropTypes.func.isRequired,
};

export default OperationVisualization;
