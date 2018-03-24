import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import D from 'js/i18n';

function InputMultiModal({ body, close }) {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={true}
			onRequestClose={close}
			contentLabel=""
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={close}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{D.btnClose}</span>
					</button>
					<h4 className="modal-title centered">{D.altLabelTitle}</h4>
				</div>
				<div className="modal-body centered">{body}</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-default btn-lg"
							onClick={close}
						>
							{D.btnClose}
						</button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

InputMultiModal.propTypes = {
	body: PropTypes.string.isRequired,
	close: PropTypes.func.isRequired,
};

export default InputMultiModal;
