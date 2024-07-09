import { useState, useEffect } from 'react';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { Select } from '@inseefr/wilco';
import { getAllAttachment } from '../../utils';
import './component-specification-form.scss';
import {
	ATTRIBUTE_PROPERTY_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants';
import Api from '../../apis/structure-api';
import { TextInput } from '../../../../new-architecture/components/form/input';

export const ComponentSpecificationForm = ({
	structureComponents,
	selectedComponent,
	component,
	onChange,
	disabled = false,
}) => {
	const [attachments, setAttachments] = useState([]);
	useEffect(() => {
		Promise.all(
			structureComponents
				.filter((c) => c.component.type === MEASURE_PROPERTY_TYPE)
				.map((measure) => Api.getMutualizedComponent(measure.component.id))
		).then((measures) => {
			setAttachments(getAllAttachment(measures, selectedComponent));
		});
	}, [structureComponents, selectedComponent]);

	return (
		<>
			<div className="row">
				<div className="col-md-12">
					<label htmlFor="component-specification-notation">{D.idTitle}</label>
					<TextInput
						value={component.notation}
						name="component-specification-notation"
						id="component-specification-notation"
						onChange={(e) => {
							onChange({
								...component,
								notation: e.target.value,
							});
						}}
						disabled={disabled}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<label htmlFor="component-specification-labelLg1">{D1.label}</label>
					<TextInput
						value={component.labelLg1}
						name="component-specification-labelLg1"
						id="component-specification-labelLg1"
						onChange={(e) => {
							onChange({
								...component,
								labelLg1: e.target.value,
							});
						}}
						disabled={disabled}
					/>
				</div>
				<div className="col-md-6">
					<label htmlFor="component-specification-labelLg2">{D2.label}</label>
					<TextInput
						value={component.labelLg2}
						name="component-specification-labelLg2"
						id="component-specification-labelLg2"
						onChange={(e) => {
							onChange({
								...component,
								labelLg2: e.target.value,
							});
						}}
						disabled={disabled}
					/>
				</div>
			</div>

			{selectedComponent.component.type === ATTRIBUTE_PROPERTY_TYPE && (
				<>
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
				</>
			)}
		</>
	);
};
