// @ts-ignore
import Modal from 'react-modal';
import { createAllDictionary } from '../../utils/dictionnary';
import { Button } from '../buttons/button';

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
