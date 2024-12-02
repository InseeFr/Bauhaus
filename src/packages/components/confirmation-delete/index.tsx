import Modal from 'react-modal';

import { createAllDictionary } from '../../utils/dictionnary';
import { ActionToolbar } from '../action-toolbar';
import { Button } from '../buttons/button';
import { CloseIconButton } from '../buttons/buttons-with-icons';

const { D } = createAllDictionary({
	deleteTitle: {
		fr: 'Suppression',
		en: 'Delete',
	},
	confirmationConceptDelete: {
		fr: 'Vous êtes sur le point de supprimer définitivement ce concept. Êtes-vous sûr ?',
		en: 'You are about to permanently delete this concept. Are you sure?',
	},
	yes: {
		fr: 'Oui',
		en: 'Yes',
	},
	no: {
		fr: 'Non',
		en: 'No',
	},
});
export const ConfirmationDelete = ({
	className,
	handleNo,
	handleYes,
	message = D.confirmationConceptDelete,
}: Readonly<{
	className?: string;
	handleNo: any;
	handleYes: any;
	message?: string;
}>) => {
	return (
		<Modal
			className={`Modal__Bootstrap modal-dialog ${className}`}
			isOpen={true}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<CloseIconButton onClick={handleNo} />
					<h4 className="modal-title">{D.deleteTitle}</h4>
				</div>

				<div className="modal-body">{message}</div>
				<div className="modal-footer text-right">
					<ActionToolbar>
						<Button action={handleNo}>{D.no}</Button>
						<Button action={handleYes}>{D.yes}</Button>
					</ActionToolbar>
				</div>
			</div>
		</Modal>
	);
};
