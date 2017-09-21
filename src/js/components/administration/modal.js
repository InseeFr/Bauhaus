import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { dictionary } from 'js/utils/dictionary';

function ModalDelete({ title, text, isOpen, closeCancel, closeValid }) {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeCancel}
			contentLabel=""
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={closeCancel}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">
							{dictionary.buttons.close}
						</span>
					</button>
					<h4 className="modal-title">
						{title}
					</h4>
				</div>
				<div className="modal-body">
					{text}
				</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closeCancel}
						>
							{dictionary.buttons.cancel}
						</button>
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closeValid}
						>
							{dictionary.buttons.validate}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

ModalDelete.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	closeCancel: PropTypes.func.isRequired,
	closeValid: PropTypes.func.isRequired,
};

export default ModalDelete;
