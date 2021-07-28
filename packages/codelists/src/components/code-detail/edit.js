import React, { useState, useCallback, useEffect } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import PropTypes from 'prop-types';
import { Stores } from 'bauhaus-utilities';
import { validateCode } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import './edit.scss';

const DumbCodeDetailEdit = ({
	code: initialCode,
	codes,
	handleSave,
	handleBack,
	serverSideError,
}) => {
	const [code, setCode] = useState({});
	useEffect(() => {
		setCode({ ...initialCode });
	}, [initialCode]);
	const [parents, setParents] = useState(code.parents);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCode({
				...code,
				[name]: value,
			});
		},
		[code]
	);

	const codesOptions = codes
		.map((code) => {
			return {
				label: code.code + ' - ' + code.labelLg1,
				value: code.code,
			};
		})
		.concat({ label: '', value: '' });

	const handleSaveClick = useCallback(() => {
		handleSave(code);
	}, [code, handleSave]);

	const { field, message } = validateCode(code);
	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton disabled={message} action={handleSaveClick} col={3} />
			</ActionToolbar>
			{message && <ErrorBloc error={message} />}
			{serverSideError && <ErrorBloc error={serverSideError} />}
			<form>
				<div className="row">
					<LabelRequired htmlFor="parents">{D.parentCodeTitle}</LabelRequired>
					<Select
						className="form-control"
						placeholder={D.parentCodeTitle}
						value={
							codesOptions.filter(
								({ value }) =>
									(parents && parents.some((parent) => parent === value)) ||
									(!parents && value === '')
							) || ''
						}
						options={codesOptions}
						onChange={(parent) => setParents(...parents, parent)}
						multi
					/>
				</div>
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="identifiant">{D.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="identifiant"
							name="identifiant"
							value={code.code}
							onChange={handleChange}
							aria-invalid={field === 'identifiant'}
						/>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-6 form-group`}>
						<LabelRequired htmlFor="labelLg1">{D1.codeLabel}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={code.labelLg1}
							aria-invalid={field === 'labelLg1'}
						/>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.codeLabel}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg2"
							name="labelLg2"
							value={code.labelLg2}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<input
							type="text"
							value={code.descriptionLg1}
							className="form-control"
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<input
							type="text"
							value={code.descriptionLg2}
							className="form-control"
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};

DumbCodeDetailEdit.propTypes = {
	code: PropTypes.object,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
};

export const CodeDetailEdit = Stores.DisseminationStatus.withDisseminationStatusListOptions(
	DumbCodeDetailEdit
);
