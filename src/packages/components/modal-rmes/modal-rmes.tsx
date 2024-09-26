//@ts-ignore
import Modal from 'react-modal';
//@ts-ignore
import DOMPurify from 'dompurify';
import { CloseIconButton } from '../buttons/buttons-with-icons';

type ModelRmesTypes = {
	id?: string;
	isOpen?: boolean;
	title?: string;
	body?: any;
	footer?: any;
	closeCancel?: any;
	modalButtons: any[];
};
export const ModalRmes = ({
	id,
	isOpen,
	title,
	body,
	footer,
	closeCancel,
	modalButtons,
}: ModelRmesTypes) => {
	const buttons = modalButtons.map((b: any, i: number) => (
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
