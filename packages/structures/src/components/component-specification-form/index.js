import React, { useState, useEffect } from 'react';
import D from '../../i18n/build-dictionary';
import { Select } from '@inseefr/wilco';
import { getAllAttachment } from '../../utils';
import './component-specification-form.scss';
import { MEASURE_PROPERTY_TYPE } from '../../utils/constants';
import Api from '../../apis/structure-api';

export const ComponentSpecificationForm = ({
	structureComponents,
	selectedComponent,
	component,
	onChange,
	disabled = false,
}) => {
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		Promise.all(structureComponents
			.filter(c => c.component.type === MEASURE_PROPERTY_TYPE)
			.map(measure => Api.getMutualizedComponent(measure.component.id)))
			.then(measures => {
				setAttachments(getAllAttachment(measures, selectedComponent));
			})
	}, [structureComponents, selectedComponent])

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
							component.attachment?.some((a) => a.includes(c.value))
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
