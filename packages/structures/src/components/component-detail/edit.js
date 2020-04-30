import React, { useState, useCallback, useEffect } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
} from '@inseefr/wilco';
import { EditorMarkdown } from 'bauhaus-utilities';
import { validateComponent, getAllAttachment } from '../../utils';
import {
	ATTRIBUTE_TYPE,
	COMPONENT_TYPES,
} from '../../utils/constants/dsd-components';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';

import { D1, D2 } from '../../i18n/build-dictionary';
import { Select } from '@inseefr/wilco';
import PropTypes from 'prop-types';

export const ComponentDetailEdit = ({
	component: defaultComponent,
	concepts = {},
	codesLists = {},
	handleSave,
	handleBack,
	mutualized = false,
	structureComponents = [],
}) => {
	const [component, setComponent] = useState(defaultComponent || {});
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		setAttachments(getAllAttachment(structureComponents));
	}, [structureComponents]);

	const handleChange = useCallback(
		e => {
			const { name, value } = e.target;
			setComponent({
				...component,
				[name]: value,
			});
		},
		[component]
	);

	const handleSaveClick = useCallback(() => {
		handleSave(component);
	}, [component, handleSave]);

	const conceptOptions = Object.values(concepts).map(({ id, label }) => ({
		value: id,
		label,
	}));
	const codeListOptions = Object.values(codesLists).map(({ id, label }) => ({
		value: id,
		label,
	}));

	const { field, message } = validateComponent(component);
	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton disabled={message} action={handleSaveClick} col={3} />
			</ActionToolbar>
			{message && <ErrorBloc error={message} />}

			<form>
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="identifiant">{D1.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="identifiant"
							name="identifiant"
							value={component.identifiant}
							onChange={handleChange}
							aria-invalid={field === 'identifiant'}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-6 form-group`}>
						<LabelRequired htmlFor="labelLg1">{D1.label}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							value={component.labelLg1}
							onChange={handleChange}
							aria-invalid={field === 'labelLg1'}
						/>
					</div>

					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">{D2.label}</LabelRequired>

						<input
							type="text"
							className="form-control"
							id="labelLg2"
							name="labelLg2"
							value={component.labelLg2}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-md-12 ">
						<Select
							id="type"
							label={D1.type}
							placeholder={D1.type}
							value={COMPONENT_TYPES.find(c => c.value === component.type)}
							options={COMPONENT_TYPES}
							name="type"
							onChange={value => setComponent({ ...component, type: value })}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-md-12">
						<Select
							id="concept"
							name="concept"
							label={D1.conceptTitle}
							placeholder={D1.conceptTitle}
							options={conceptOptions}
							value={conceptOptions.find(
								c => c.value === component.concept?.toString()
							)}
							onChange={value => setComponent({ ...component, concept: value })}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<Select
							id="range"
							name="range"
							label={D1.rangeTitle}
							placeholder={D1.rangeTitle}
							value={XSD_TYPES.find(c => c.value === component.range)}
							options={XSD_TYPES}
							onChange={value => setComponent({ ...component, range: value })}
						/>
					</div>
				</div>

				{component.range === XSD_CODE_LIST && (
					<div className="row">
						<div className="col-md-12 form-group">
							<Select
								type="text"
								className="form-control"
								id="codeList"
								name="codeList"
								label={D1.codesListTitle}
								placeholder={D1.codesListTitle}
								options={codeListOptions}
								value={codeListOptions.find(
									c => c.value === component.codeList?.toString()
								)}
								onChange={value =>
									setComponent({ ...component, codeList: value })
								}
							/>
						</div>
					</div>
				)}
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<EditorMarkdown
							text={component.descriptionLg1}
							handleChange={value =>
								setComponent({ ...component, descriptionLg1: value })
							}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<EditorMarkdown
							text={component.descriptionLg2}
							handleChange={value =>
								setComponent({ ...component, descriptionLg2: value })
							}
						/>
					</div>
				</div>

				{component.type === ATTRIBUTE_TYPE && !mutualized && (
					<React.Fragment>
						<hr />
						<h4>{D1.componentSpecificationTitle}</h4>

						<div className="row">
							<div className="col-md-12">
								<Select
									id="attachment"
									name="attachment"
									label={D1.attachmentTitle}
									placeholder={D1.attachmentTitle}
									value={attachments.filter(
										c => component.attachment?.indexOf(c.value) >= 0
									)}
									multi
									options={attachments}
									onChange={value => {
										setComponent({
											...component,
											attachment: value.map(v => v.value),
										});
									}}
								/>
							</div>
						</div>
					</React.Fragment>
				)}
			</form>
		</React.Fragment>
	);
};

ComponentDetailEdit.propTypes = {
	component: PropTypes.object,
	concepts: PropTypes.array,
	codesLists: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
};
