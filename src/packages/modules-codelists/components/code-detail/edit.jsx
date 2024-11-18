import Select from '@components/select-rmes';
import { useCallback, useEffect, useState } from 'react';
import {
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
} from '../../../../utils';
import { Row, TextInput } from '../../../components';
import { ActionToolbar } from '@components/action-toolbar';
import { SaveButton } from '@components/buttons/buttons-with-icons';
import LabelRequired from '@components/label-required';
import { AddLogo } from '@components/logo/logo-add';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import { validateCode } from '../../utils';
import './edit.scss';
import { emptyCode } from './empty-code';

export const CodeDetailEdit = ({
	code: initialCode,
	codes,
	serverSideError,
	deleteCode,
	deleteCodeWithChildren,
	updateCode,
	createCode,
}) => {
	const [code, setCode] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [updateMode, setUpdateMode] = useState(true);

	useEffect(() => {
		setCode({ ...initialCode });
		setUpdateMode(initialCode.code);
	}, [initialCode]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setClientSideErrors({
				...clientSideErrors,
				errorMessage: [],
			});
			setCode({
				...code,
				[name]: value,
			});
		},
		[clientSideErrors, code],
	);

	const isDescendant = (ancestor, descendant) => {
		if (ancestor === descendant) return true;
		if (descendant === '') return false;
		return codes
			.find((c) => c.code === descendant)
			.parents?.some((parent) => isDescendant(ancestor, parent.code));
	};

	const codesOptions = codes
		.filter(({ code }) => code !== '')
		.map((code) => {
			return {
				label: code.code + ' - ' + code.labelLg1,
				value: code.code,
			};
		})
		.concat({ label: ' - ', value: '' });

	const save = () => {
		const clientSideErrors = validateCode(code, codes, updateMode);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			updateCode(code);
			setUpdateMode(true);
		}
	};

	return (
		<>
			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
					D={D}
				/>
			)}
			{serverSideError && <ErrorBloc error={serverSideError} D={D} />}
			<div>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="parents">{D.parentCodeTitle}</label>
						<Select
							placeholder={D.parentCodeTitle}
							value={codesOptions.filter((option) =>
								code.parents?.find((p) => p.code === option.value),
							)}
							options={codesOptions.filter(
								(c) => !code.code || !isDescendant(code.code, c.value),
							)}
							onChange={(parents) => {
								setCode({
									...code,
									parents:
										parents?.map(({ value }) => ({
											code: value,
											position: 0,
										})) || [],
								});
							}}
							multi
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="code">{D.idTitle}</LabelRequired>
						<TextInput
							id="code"
							name="code"
							value={code.code || ''}
							onChange={handleChange}
							disabled={updateMode}
							aria-invalid={!!clientSideErrors.fields?.code}
							aria-describedby={
								clientSideErrors.fields?.code ? 'code-error' : null
							}
						/>
						<ClientSideError
							id="code-error"
							error={clientSideErrors?.fields?.code}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">{D1.codeLabel}</LabelRequired>
						<TextInput
							id="labelLg1"
							name="labelLg1"
							value={code.labelLg1 || ''}
							onChange={handleChange}
							aria-invalid={!!clientSideErrors.fields?.labelLg1}
							aria-describedby={
								clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
							}
						/>
						<ClientSideError
							id="labelLg1-error"
							error={clientSideErrors?.fields?.labelLg1}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.codeLabel}</LabelRequired>
						<TextInput
							id="labelLg2"
							name="labelLg2"
							value={code.labelLg2 || ''}
							onChange={handleChange}
							aria-invalid={!!clientSideErrors.fields?.labelLg2}
							aria-describedby={
								clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
							}
						/>
						<ClientSideError
							id="labelLg2-error"
							error={clientSideErrors?.fields?.labelLg2}
						></ClientSideError>
					</div>
				</Row>

				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D1.descriptionTitle}</label>
						<TextInput
							value={code.descriptionLg1 || ''}
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<TextInput
							value={code.descriptionLg2 || ''}
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</Row>
			</div>
			<ActionToolbar>
				<SaveButton disabled={clientSideErrors.length > 0} onClick={save} />
				<button
					type="button"
					disabled={!code.code}
					onClick={() => {
						const newCodePosition =
							codes.parents && Object.values(codes.parents).position
								? Math.max(Object.values(codes.parents).position) + 1
								: 1;
						const newCode = {
							code: '',
							parents: code.parents
								? Object.values(code.parents).map((parent) => {
										return {
											code: parent.code || '',
											position: newCodePosition,
										};
									})
								: [{ code: '', position: newCodePosition }],
							labelLg1: '',
							labelLg2: '',
							descriptionLg1: '',
							descriptionLg2: '',
						};
						createCode(newCode);
						setCode(newCode);
						setUpdateMode(false);
					}}
					className="btn wilco-btn btn-lg col-md-12"
				>
					<AddLogo />
					<span> {D.btnNew}</span>
				</button>
				<button
					type="button"
					disabled={!code.code}
					onClick={() => {
						deleteCode(code);
						setCode(emptyCode);
						setUpdateMode(false);
					}}
					className="btn wilco-btn btn-lg col-md-12"
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
					<span> {D.btnDelete}</span>
				</button>
				<button
					type="button"
					icon="trash"
					disabled={!code.code}
					onClick={() => {
						deleteCodeWithChildren(code);
						setCode(emptyCode);
						setUpdateMode(false);
					}}
					className="btn wilco-btn btn-lg col-md-12"
				>
					<span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
					<span> {D.btnDeleteWithChildren}</span>
				</button>
			</ActionToolbar>
		</>
	);
};
