import React, { useState, useCallback, useEffect } from 'react';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	ErrorBloc,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import { validateComponent } from '../../utils';
import { D1, D2 } from '../../i18n/build-dictionary';
import PropTypes from 'prop-types';
import { default as ReactSelect } from 'react-select';
import './edit.scss';

const defaultCodelist = {
	contributor: 'DG75-H250',
};
const DumbCodelistDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	type,
	disseminationStatusListOptions,
	stampListOptions,
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	useEffect(() => {
		setCodelist({ ...initialCodelist, ...defaultCodelist });
	}, [initialCodelist]);
	useEffect(() => {
		if (!codelist.type && type) {
			setCodelist({ ...defaultCodelist, ...initialCodelist, type });
		}
	}, [type, codelist, initialCodelist]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCodelist({
				...codelist,
				[name]: value,
			});
		},
		[codelist]
	);

	const handleSaveClick = useCallback(() => {
		handleSave(codelist);
	}, [codelist, handleSave]);

	const { field, message } = validateComponent(codelist);
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
						<LabelRequired htmlFor="identifiant">{D1.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="identifiant"
							name="identifiant"
							value={codelist.identifiant}
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
							value={codelist.labelLg1}
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
							value={codelist.labelLg2}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="form-group">
					<label>{D1.creatorTitle}</label>
					<Select
						className="form-control"
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.creator
						)}
						options={stampListOptions}
						onChange={(value) => setCodelist({ ...codelist, creator: value })}
						searchable={true}
					/>
				</div>
				<div className="form-group">
					<label>{D1.contributorTitle}</label>
					<ReactSelect
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.contributor
						)}
						options={stampListOptions}
						onChange={(value) =>
							setCodelist({ ...codelist, contributor: value })
						}
						isDisabled={true}
					/>
				</div>
				<div className="form-group">
					<label>{D1.disseminationStatusTitle}</label>
					<Select
						className="form-control"
						placeholder={D1.disseminationStatusPlaceholder}
						value={disseminationStatusListOptions.find(
							({ value }) => value === codelist.disseminationStatus
						)}
						options={disseminationStatusListOptions}
						onChange={(value) =>
							setCodelist({ ...codelist, disseminationStatus: value })
						}
						searchable={true}
					/>
				</div>
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<input
							type="text"
							value={codelist.descriptionLg1}
							className="form-control"
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<input
							type="text"
							value={codelist.descriptionLg2}
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

DumbCodelistDetailEdit.propTypes = {
	component: PropTypes.object,
	disseminationStatusListOptions: PropTypes.array,
	stampListOptions: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	secondLang: PropTypes.bool,
};

DumbCodelistDetailEdit.defaultProps = {
	disseminationStatusListOptions: [],
	stampListOptions: [],
};

export const CodeListDetailEdit = Stores.DisseminationStatus.withDisseminationStatusListOptions(
	DumbCodelistDetailEdit
);
