import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import DOMPurify from 'dompurify';
import { dictionary } from 'js/utils/dictionary';

function ConfirmModal({
	label,
	isOpen,
	versioningIsPossible,
	closeCancel,
	closeMinor,
	closeMajor,
}) {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeCancel}
			contentLabel={label}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={closeCancel}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{dictionary.buttons.close}</span>
					</button>
					<h4 className="modal-title">{dictionary.concept.versioning.title}</h4>
				</div>
				<div className="modal-body">
					{/* TODO no need for DOMPurify here, it should be called before
           sending the data, or before opening this window  */}
					<div
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								dictionary.concept.versioning.body([label])
							),
						}}
					/>
				</div>
				<div className="modal-footer">
					<div className="centered">
						<button
							type="button"
							className="btn btn-primary btn-lg"
							onClick={closeMinor}
						>
							{dictionary.buttons.minorVersion}
						</button>
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
							onClick={closeMajor}
							disabled={!versioningIsPossible}
						>
							{dictionary.buttons.majorVersion}
						</button>
					</div>
					{/* TODO no need for DOMPurify here
            TODO better use a component in the dictionary  */}
					{!versioningIsPossible && (
						<div
							style={{ 'text-align': 'left', marginTop: '20px' }}
							className="red"
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(
									dictionary.concept.versioning.footer
								),
							}}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
}

ConfirmModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	versioningIsPossible: PropTypes.bool.isRequired,
	closeCancel: PropTypes.func.isRequired,
	closeMinor: PropTypes.func.isRequired,
	closeMajor: PropTypes.func.isRequired,
};

export default ConfirmModal;
