import React from 'react';
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
					<h4 className="modal-title text-center">{D.altLabelTitle}</h4>
				</div>
				<div className="modal-body text-center">{body}</div>
				<div className="modal-footer">
					<div className="text-center">
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

export default InputMultiModal;
