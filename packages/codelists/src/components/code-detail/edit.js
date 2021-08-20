import React, { useState, useCallback, useEffect } from 'react';
import { ErrorBloc, LabelRequired, Select, AbstractButton, ActionToolbar, SaveButton, NewButton, DeleteButton } from '@inseefr/wilco';
import PropTypes from 'prop-types';
import { Stores } from 'bauhaus-utilities';
import { validateCode } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import './edit.scss';

/**
 * TODO:
 * - Gérer l'ajout d'un nouveau code
 * - Gérer la sauvegarde d'un code existant
 * - Gérer la transformation TreeView -> Structure de données pour l'API
 * - Gérer la suppression d'un code et remontée des enfants
 * - gérer la suppression d'un code et suppression des enfants
 * - Gérer le DragnDrop
 */
const DumbCodeDetailEdit = ({ code: initialCode, codes, serverSideError, isCreation }) => {
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

	const { field, message } = validateCode(code);
	console.log(code)
	return (
		<React.Fragment>
			{message && <ErrorBloc error={message} />}
			{serverSideError && <ErrorBloc error={serverSideError} />}
			<form>
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="parents">{D.parentCodeTitle}</LabelRequired>
						<Select
							className="form-control"
							placeholder={D.parentCodeTitle}
							value={codesOptions.filter(option => code.parents?.find(p => p === option.value))}

							options={codesOptions}
							onChange={(parent) => setParents(...parents, parent)}
							multi
						/>
					</div>
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

				<ActionToolbar>
					<SaveButton disabled={message} action={() => {}} col={3} />
					<NewButton disabled={!code.code} action={() => {}} col={3} />
					<DeleteButton disabled={!code.code} action={() => {}} col={3} />
					<AbstractButton icon="trash" disabled={!code.code} action={() => {}} col={4}>
						{D.btnDeleteWithChildren}
					</AbstractButton>
				</ActionToolbar>
			</form>
		</React.Fragment>
	);
};

DumbCodeDetailEdit.propTypes = {
	code: PropTypes.object,
	secondLang: PropTypes.bool,
};

export const CodeDetailEdit =
	Stores.DisseminationStatus.withDisseminationStatusListOptions(
		DumbCodeDetailEdit
	);
