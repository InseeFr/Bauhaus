import React, { useState, useCallback } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
} from '@inseefr/wilco';
import { validateComponent } from '../../utils';
import { ATTACHMENTS } from '../../utils/constants/attachments';
import {
	ATTRIBUTE_TYPE,
	COMPONENT_TYPES,
} from '../../utils/constants/dsd-components';
import { XSD_CODE_LIST, XSD_TYPES } from '../../utils/constants/xsd';

import D from '../../i18n/build-dictionary';
import { Select } from '@inseefr/wilco';

import PropTypes from 'prop-types';

export const ComponentDetailEdit = ({
	component: defaultComponent,
	concepts = {},
	codesLists = {},
	handleSave,
	handleBack,
	secondLang,
}) => {
	const [component, setComponent] = useState(defaultComponent);

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
						<label htmlFor="id">{D.idTitle}</label>
						<input
							type="text"
							className="form-control"
							id="id"
							name="id"
							value={component.id}
							onChange={handleChange}
							aria-invalid={field === 'id'}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-${secondLang ? 6 : 12} form-group`}>
						<label htmlFor="labelLg1">{D.label}</label>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							value={component.labelLg1}
							onChange={handleChange}
						/>
					</div>
					{secondLang && (
						<div className="col-md-6 form-group">
							<label htmlFor="labelLg2">{D.label}</label>
							<input
								type="text"
								className="form-control"
								id="labelLg2"
								name="labelLg2"
								value={component.labelLg2}
								onChange={handleChange}
							/>
						</div>
					)}
				</div>

				<div className="row">
					<div className="col-md-12 ">
						<Select
							id="type"
							label={D.type}
							placeholder={D.type}
							value={COMPONENT_TYPES.find(c => c.value === component.type)}
							options={COMPONENT_TYPES}
							name="type"
							onChange={value => setComponent({ ...component, type: value })}
						/>
					</div>
				</div>
				{component.type === ATTRIBUTE_TYPE && (
					<div className="row">
						<div className="col-md-12">
							<Select
								id="attachment"
								name="attachment"
								label={D.attachmentTitle}
								placeholder={D.attachmentTitle}
								value={ATTACHMENTS.find(c => c.value === component.attachment)}
								options={ATTACHMENTS}
								onChange={value =>
									setComponent({ ...component, attachment: value })
								}
							/>
						</div>
					</div>
				)}

				<div className="row">
					<div className="col-md-12">
						<Select
							id="concept"
							name="concept"
							label={D.conceptTitle}
							placeholder={D.conceptTitle}
							options={conceptOptions}
							value={conceptOptions.find(c => c.value === component.concept)}
							onChange={value => setComponent({ ...component, concept: value })}
						/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<Select
							id="range"
							name="range"
							label={D.rangeTitle}
							placeholder={D.rangeTitle}
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
								label={D.codesListTitle}
								placeholder={D.codesListTitle}
								options={codeListOptions}
								value={codeListOptions.find(
									c => c.value === component.codeList
								)}
								onChange={value =>
									setComponent({ ...component, codeList: value })
								}
							/>
						</div>
					</div>
				)}
			</form>
		</React.Fragment>
	);
};

ComponentDetailEdit.propTypes = {
	component: PropTypes.object,
	concepts: PropTypes.object,
	codesLists: PropTypes.object,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
};
