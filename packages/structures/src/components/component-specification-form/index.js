import React, { useState, useEffect } from 'react';
import D from '../../i18n/build-dictionary';
import { Select } from '@inseefr/wilco';
import { getAllAttachment } from '../../utils';
import './component-specification-form.scss';
import { OBSERVATION } from '../../utils/constants/';

export const ComponentSpecificationForm = ({
	structureComponents,
	component,
	onChange,
	disabled = false,
}) => {
	const [attachments, setAttachments] = useState([]);
	componentAttachment = component.attachment
		? component.attachment
		: [OBSERVATION];
	console.log(componentAttachment);
	useEffect(() => {
		setAttachments(getAllAttachment(structureComponents));
	}, [structureComponents]);

	return (
		<React.Fragment>
			<div className="row bauhaus-component-specification-form">
				<div className="col-md-12">
					<Select
						id="attachment"
						name="attachment"
						label={D.attachmentTitle}
						placeholder={D.attachmentTitle}
						value={attachments.filter((c) =>
							componentAttachment?.some((a) => a.includes(c.value))
						)}
						multi
						options={attachments}
						onChange={(value) => {
							onChange({
								...component,
								attachment: value?.map((v) => v.value),
							});
						}}
						disabled={disabled}
					/>
				</div>
			</div>
			<div className="row">
				<fieldset className="col-md-12 checkbox ">
					<legend>{D.requiredSpecificationTitle}</legend>

					<label className="radio-inline">
						<input
							type="radio"
							checked={component.required}
							name="required"
							onChange={() => {
								onChange({
									...component,
									required: true,
								});
							}}
							disabled={disabled}
						/>
						{D.yes}
					</label>
					<label className="radio-inline">
						<input
							type="radio"
							checked={!component.required}
							name="required"
							onChange={() => {
								onChange({
									...component,
									required: false,
								});
							}}
							disabled={disabled}
						/>
						{D.no}
					</label>
				</fieldset>
			</div>
		</React.Fragment>
	);
};
