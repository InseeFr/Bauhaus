import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { D1 } from '../../i18n/build-dictionary';
import { Select, SaveButton } from '@inseefr/wilco';
import { getAllAttachment } from '../../utils';
import './component-specification-modal.scss';
export default ({
	specification: defaultSpecification,
	structureComponents,
	onClose,
	onSave,
}) => {
	const [specification, setSpecification] = useState(
		defaultSpecification || {}
	);
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		setAttachments(getAllAttachment(structureComponents));
	}, [structureComponents]);

	return (
		<Modal
			className="Modal__Bootstrap modal-dialog structures structures-specification-modal"
			isOpen={true}
			ariaHideApp={false}
		>
			<div className="modal-content">
				<div className="modal-header">
					<button type="button" className="close" onClick={onClose}>
						<span aria-hidden="true">&times;</span>
						<span className="sr-only">{'btnClose'}</span>
					</button>
					<h4 className="modal-title">{D1.componentSpecificationTitle}</h4>
				</div>

				<div className="modal-body">
					<div className="row">
						<div className="col-md-12">
							<Select
								id="attachment"
								name="attachment"
								label={D1.attachmentTitle}
								placeholder={D1.attachmentTitle}
								value={attachments.filter(
									c => specification.attachment?.indexOf(c.value) >= 0
								)}
								multi
								options={attachments}
								onChange={value => {
									setSpecification({
										...specification,
										attachment: value.map(v => v.value),
									});
								}}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12 checkbox">
							<label>
								<input
									type="checkbox"
									label={D1.attachmentTitle}
									value={specification.required}
									onChange={e => {
										setSpecification({
											...specification,
											required: e.target.checked,
										});
									}}
								/>
								{D1.requiredSpecificationTitle}
							</label>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<div className="text-right">
						<SaveButton
							col={4}
							offset={8}
							action={() => onSave(specification)}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};
