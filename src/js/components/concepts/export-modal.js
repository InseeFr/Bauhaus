import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import { dictionary } from 'js/utils/dictionary';

function ExportModal({ label, isOpen, closeCancel, closePdf, closeOdt }) {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeCancel}
			contentLabel={label}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={closeCancel}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{dictionary.buttons.close}</span>
					</button>
					<h4 className="modal-title">{dictionary.concept.exporting.title}</h4>
				</div>
				<div className="modal-body">
					{/* TODO no need for DOMPurify here, it should be called before
           sending the data, or before opening this window  */}
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								dictionary.concept.exporting.body([label])
							),
						}}
					/>
				</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-default btn-lg"
							onClick={closeCancel}
						>
							{dictionary.buttons.cancel}
						</button>
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closePdf}
						>
							{dictionary.buttons.pdfButton}
						</button>
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closeOdt}
						>
							{dictionary.buttons.odtButton}
						</button>
					</div>
					{/* TODO no need for DOMPurify here
            TODO better use a component in the dictionary  */}
				</div>
			</div>
		</Modal>
	);
}

ExportModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	closeCancel: PropTypes.func.isRequired,
	closePdf: PropTypes.func.isRequired,
	closeOdt: PropTypes.func.isRequired,
};

export default ExportModal;
