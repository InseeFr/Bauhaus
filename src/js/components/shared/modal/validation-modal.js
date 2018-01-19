import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import { dictionary } from 'js/utils/dictionary';

function ValidationModal({ title, text, isOpen, closeModal, confirmModal }) {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeModal}
			contentLabel=""
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={closeModal}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{dictionary.buttons.close}</span>
					</button>
					<h4 className="modal-title">{title}</h4>
				</div>
				<div className="modal-body">
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(text),
						}}
					/>
				</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closeModal}
						>
							{dictionary.buttons.cancel}
						</button>
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={confirmModal}
						>
							{dictionary.buttons.validate}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

ValidationModal.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
	closeModal: PropTypes.func.isRequired,
	confirmModal: PropTypes.func.isRequired,
};

export default ValidationModal;
