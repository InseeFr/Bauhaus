import React, { useState, useCallback, useEffect } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
} from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { validateCode } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import PropTypes from 'prop-types';
import './edit.scss';

const DumbCodeDetailEdit = ({
	code: initialCode,
	handleSave,
	handleBack,
	serverSideError,
}) => {
	const [code, setCode] = useState({});
	useEffect(() => {
		setCode({ ...initialCode });
	}, [initialCode]);

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
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="identifiant">{D.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="identifiant"
							name="identifiant"
							value={code.id}
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
							onChange={handleChange}
							value={code.labelLg1}
							aria-invalid={field === 'labelLg1'}
						/>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.label}</LabelRequired>

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
