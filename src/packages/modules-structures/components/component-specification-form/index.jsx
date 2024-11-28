import { useEffect, useState } from 'react';

import { TextInput } from '@components/form/input';
import { Column, Row } from '@components/layout';
import { Select } from '@components/select-rmes';

import { StructureApi } from '@sdk/index';

import D, { D1, D2 } from '../../i18n/build-dictionary';
import { getAllAttachment } from '../../utils';
import {
	ATTRIBUTE_PROPERTY_TYPE,
	MEASURE_PROPERTY_TYPE,
} from '../../utils/constants';
import './component-specification-form.scss';

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
				.map((measure) =>
					StructureApi.getMutualizedComponent(measure.component.id),
				),
		).then((measures) => {
			setAttachments(getAllAttachment(measures, selectedComponent));
		});
	}, [structureComponents, selectedComponent]);

	return (
		<>
			<Row>
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
			</Row>
			<Row>
				<Column>
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
				</Column>
				<Column>
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
				</Column>
			</Row>

			{selectedComponent.component.type === ATTRIBUTE_PROPERTY_TYPE && (
				<>
					<div className="row bauhaus-component-specification-form">
						<label className="col-md-12">
							{D.attachmentTitle}
							<Select
								placeholder={D.attachmentTitle}
								value={attachments.filter((c) =>
									component.attachment?.some((a) => a.includes(c.value)),
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
						</label>
					</div>
					<Row>
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
					</Row>
				</>
			)}
		</>
	);
};
