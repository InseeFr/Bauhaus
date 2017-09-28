import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { dictionary } from 'js/utils/dictionary';

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
						<span className="sr-only">
							{dictionary.buttons.close}
						</span>
					</button>
					<h4 className="modal-title centered">Libellé alternatif</h4>
				</div>
				<div className="modal-body centered">
					{body}
				</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-default btn-lg"
							onClick={close}
						>
							Fermer
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
