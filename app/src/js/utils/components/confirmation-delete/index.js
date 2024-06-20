import React from 'react';
import { Button } from '@inseefr/wilco';
import Modal from 'react-modal';
import D from '../../i18n/build-dictionary';

const ConfirmationDelete = ({ className, handleNo, handleYes, message = D.confirmationConceptDelete }) => {
	return (
		<Modal
			className={`Modal__Bootstrap modal-dialog ${className}`}
			isOpen={true}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={handleNo}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{'btnClose'}</span>
					</button>
					<h4 className="modal-title">{D.deleteTitle}</h4>
				</div>

				<div className="modal-body">{message}</div>
				<div className="modal-footer text-right">
					<Button offset={8} action={handleNo}>
						{D.no}
					</Button>
					<Button action={handleYes}>{D.yes}</Button>
				</div>
			</div>
		</Modal>
	);
};
export default ConfirmationDelete;
