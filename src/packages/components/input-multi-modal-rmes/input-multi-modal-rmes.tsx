import Modal from 'react-modal';

import { createAllDictionary } from '../../utils/dictionnary';
import { CloseButton, CloseIconButton } from '../buttons/buttons-with-icons';

const { D } = createAllDictionary({
	altLabelTitle: {
		fr: 'Libellé alternatif',
		en: 'Alternative label',
	},
});
export const InputMultiModal = ({
	body,
	close,
}: Readonly<{ body: string; close: () => void }>) => {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog"
			isOpen={true}
			onRequestClose={close}
			contentLabel=""
		>
			<div className="modal-content">
				<div className="modal-header">
					<CloseIconButton onClick={close} />
					<h4 className="modal-title text-center">{D.altLabelTitle}</h4>
				</div>
				<div className="modal-body text-center">{body}</div>
				<div className="modal-footer">
					<div className="text-center">
						<CloseButton onClick={close} />
					</div>
				</div>
			</div>
		</Modal>
	);
};
