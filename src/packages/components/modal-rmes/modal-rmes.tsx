//@ts-ignore
//@ts-ignore
import DOMPurify from 'dompurify';
import { ReactNode } from 'react';
import Modal from 'react-modal';

import { CloseIconButton } from '../buttons/buttons-with-icons';

export interface ModalButton {
	style: string;
	action: () => void;
	disabled: boolean;
	label: string | ReactNode;
}
export interface ModalRmesTypes {
	id?: string;
	isOpen?: boolean;
	title?: string;
	body?: Node;
	footer?: Node;
	closeCancel: () => void;
	modalButtons: ModalButton[];
}
export const ModalRmes = ({
	id,
	isOpen,
	title,
	body,
	footer,
	closeCancel,
	modalButtons,
}: ModalRmesTypes) => {
	const buttons = modalButtons.map((b: ModalButton, i: number) => (
		<button
			key={`${id}-${i}`}
			type="button"
			className={`btn btn-${b.style} btn-lg`}
			onClick={b.action}
			disabled={b.disabled}
		>
			{b.label}
		</button>
	));
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={isOpen}
			onRequestClose={closeCancel}
			contentLabel={body}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<CloseIconButton onClick={closeCancel} />
					<h4 className="modal-title">{title}</h4>
				</div>
				{body && (
					<div className="modal-body">
						<div
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(body),
							}}
						/>
					</div>
				)}
				<div className="modal-footer">
					<div className="text-center">{buttons}</div>
					{footer && (
						<div
							style={{ textAlign: 'left', marginTop: '20px' }}
							className="red"
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(footer),
							}}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
};
