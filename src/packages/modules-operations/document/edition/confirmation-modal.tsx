import Modal from 'react-modal';
import D from '../../../deprecated-locales';
import { ActionToolbar } from '@components/action-toolbar';
import { Button } from '@components/buttons/button';
import { CloseIconButton } from '@components/buttons/buttons-with-icons';
import { isDocument } from '../utils';

type ConfirmationModalTypes = {
	isOpen: true;
	document: any;
	onYes: () => void;
	onNo: () => void;
};
export const ConfirmationModal = ({
	document,
	isOpen,
	onYes,
	onNo,
}: Readonly<ConfirmationModalTypes>) => {
	const modalButtons = [
		{
			label: D.no,
			action: onNo,
		},
		{
			label: D.yes,
			action: onYes,
		},
	];

	const buttons = modalButtons.map((b) => (
		<Button key={b.label} type="button" action={b.action}>
			{b.label}
		</Button>
	));

	return (
		<Modal
			className="Modal__Bootstrap modal-dialog operations"
			id="updating-document-modal"
			isOpen={isOpen}
			onRequestClose={onNo}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<CloseIconButton onClick={onNo} />
					<h4 className="modal-title">{D.confirmation}</h4>
				</div>
				<div className="modal-body">
					<p>
						{isDocument(document)
							? D.warningDocumentWithSimsPrefix
							: D.warningLinkWithSimsPrefix}
					</p>
					<ul>
						{document.sims?.map((sims: any) => (
							<li key={sims.id}>{sims.labelLg1}</li>
						))}
					</ul>
					<p>{D.warningDocumentLinksWithSimsSuffix}</p>
				</div>
				<div className="modal-footer">
					<ActionToolbar>{buttons}</ActionToolbar>
				</div>
			</div>
		</Modal>
	);
};
