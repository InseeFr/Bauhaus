import { useState } from 'react';
import Modal from 'react-modal';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CloseIconButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';

import D from '../../i18n/build-dictionary';
import { ComponentSpecificationForm } from '../component-specification-form';
import './component-specification-modal.css';

export const ComponentSpecificationModalBody = ({
	specification: defaultSpecification,
	structureComponents,
	selectedComponent,
	onClose,
	onSave,
	disabled = false,
}) => {
	const [specification, setSpecification] = useState(
		defaultSpecification || {},
	);

	return (
		<div className="modal-content">
			<div className="modal-header">
				<CloseIconButton onClick={onClose} />
				<h4 className="modal-title">{D.componentSpecificationTitle}</h4>
			</div>

			<div className="modal-body">
				<ComponentSpecificationForm
					onChange={setSpecification}
					component={specification}
					selectedComponent={selectedComponent}
					structureComponents={structureComponents}
				/>
			</div>
			<div className="modal-footer">
				<ActionToolbar>
					<SaveButton
						disabled={disabled}
						action={() => onSave(specification)}
					/>
				</ActionToolbar>
			</div>
		</div>
	);
};

const ComponentSpecificationModal = (props) => {
	return (
		<Modal
			className="Modal__Bootstrap modal-dialog structures structures-specification-modal"
			isOpen={true}
			ariaHideApp={false}
		>
			<ComponentSpecificationModalBody {...props} />
		</Modal>
	);
};

export default ComponentSpecificationModal;
