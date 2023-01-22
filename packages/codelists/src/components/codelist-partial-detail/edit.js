import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { default as ReactSelect } from 'react-select';
import {
	CancelButton,
	SaveButton,
	ActionToolbar,
	LabelRequired,
	Select,
} from '@inseefr/wilco';
import { Stores, useTitle, ErrorBloc, GlobalClientSideErrorBloc, ClientSideError } from 'bauhaus-utilities';
import Picker from './picker';
import { API } from '../../apis';
import { validatePartialCodelist, partialInGlobalCodes, validateCodelist } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import '../codelist-detail/edit.scss';
import MainDictionary from '../../../../../app/src/js/i18n/build-dictionary';

const defaultCodelist = {
	contributor: 'DG75-L201',
	created: dayjs(),
};
const DumbCodelistPartialDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	updateMode,
	disseminationStatusListOptions,
	stampListOptions,
	globalCodeListOptions,
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	const [parentCodes, setParentCodes] = useState([]);
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useTitle(D.codelistsTitle, codelist?.labelLg1 || D.codelistsCreateTitle);

	const handleParentCode = useCallback(
		(code) => {
			API.getDetailedCodelist(code).then((parentCL) => {
				const globalWithPartialCodes =
					partialInGlobalCodes(
						Object.values(parentCL.codes || {}),
						Object.values(codelist.codes || {})
					) || [];
				setParentCodes(globalWithPartialCodes);
			});
		},
		[codelist.codes]
	);

	const handleParent = useCallback(
		(value) => {
			setCodelist({
				...codelist,
				parentCode: value,
				iriParent: globalCodeListOptions?.find(
					(parentCL) => parentCL.value === value
				).iriParent,
			});
			handleParentCode(value);
		},
		[codelist, handleParentCode, globalCodeListOptions]
	);

	useEffect(() => {
		setCodelist({ ...initialCodelist, ...defaultCodelist });
		if (initialCodelist.parentCode) {
			handleParentCode(initialCodelist.parentCode);
		} else {
			setParentCodes([]);
		}
	}, [initialCodelist, handleParentCode]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setClientSideErrors({
				...clientSideErrors,
				errorMessage: []
			});

			setCodelist({
				...codelist,
				[name]: value,
			});
		},
		[codelist]
	);

	const addAllClickHandler = useCallback(() => {
		const selectedParents = parentCodes.map((c) => {
			return { ...c, isPartial: true };
		});
		setParentCodes(selectedParents);
	}, [parentCodes]);

	const removeAllClickHandler = useCallback(() => {
		const unselectedParents = parentCodes.map((c) => {
			return { ...c, isPartial: false };
		});
		setParentCodes(unselectedParents);
	}, [parentCodes]);

	const addClickHandler = useCallback(
		(currentCode) => {
			setParentCodes(
				parentCodes.map((c) => {
					if (c.code === currentCode) {
						return { ...c, isPartial: true };
					}
					return c;
				})
			);
		},
		[parentCodes]
	);

	const removeClickHandler = useCallback(
		(currentCode) => {
			setParentCodes(
				parentCodes.map((c) => {
					if (c.code === currentCode) {
						return { ...c, isPartial: false };
					}
					return c;
				})
			);
		},
		[parentCodes]
	);

	const handleSaveClick = useCallback(() => {
		const clientSideErrors = validatePartialCodelist(codelist);

		if(clientSideErrors.errorMessage?.length > 0){
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			handleSave(codelist, parentCodes);
		}

	}, [codelist, parentCodes, handleSave]);

	return (
		<React.Fragment>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton disabled={clientSideErrors.errorMessage?.length > 0} action={handleSaveClick} col={3} />
			</ActionToolbar>
			{ submitting && clientSideErrors && <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} D={D}/> }
			{serverSideError && <ErrorBloc error={serverSideError} D={MainDictionary}/>}
			<form>
				<div className="row">
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="id">{D1.idTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="id"
							name="id"
							value={codelist.id || ''}
							onChange={handleChange}
							disabled={updateMode}
							aria-invalid={!!clientSideErrors.fields?.id}
							aria-describedby={!!clientSideErrors.fields?.id ? 'id-error' : null}
						/>
						<ClientSideError id="id-error" error={clientSideErrors?.fields?.id}></ClientSideError>
					</div>
				</div>
				<div className="row">
					<div className={`col-md-12 form-group`}>
						<LabelRequired htmlFor="parentCode">
							{D1.parentCodelist}
						</LabelRequired>
						<Select
							className="form-control"
							placeholder={D1.parentCodelistPlaceholder}
							value={globalCodeListOptions?.find(
								({ value }) => value === codelist.parentCode
							)}
							options={globalCodeListOptions}
							onChange={handleParent}
							searchable={true}
							disabled={updateMode}
						/>
						<ClientSideError id="parentCode-error" error={clientSideErrors?.fields?.parentCode}></ClientSideError>

					</div>
				</div>
				<div className="row">
					<div className={`col-md-6 form-group`}>
						<LabelRequired htmlFor="labelLg1">{D1.labelTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={codelist.labelLg1 || ''}
							aria-invalid={!!clientSideErrors.fields?.labelLg1}
							aria-describedby={!!clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null}
						/>
						<ClientSideError id="labelLg1-error" error={clientSideErrors?.fields?.labelLg1}></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.labelTitle}</LabelRequired>
						<input
							type="text"
							className="form-control"
							id="labelLg2"
							name="labelLg2"
							onChange={handleChange}
							value={codelist.labelLg2 || ''}
							aria-invalid={!!clientSideErrors.fields?.labelLg2}
							aria-describedby={!!clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null}
						/>
						<ClientSideError id="labelLg2-error" error={clientSideErrors?.fields?.labelLg2}></ClientSideError>
					</div>
				</div>
				<div className="form-group">
					<LabelRequired htmlFor="creator">{D1.creator}</LabelRequired>
					<Select
						className="form-control"
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.creator
						)}
						options={stampListOptions}
						onChange={(value) => {
							setCodelist({ ...codelist, creator: value });
							setClientSideErrors({
								...clientSideErrors,
								errorMessage: []
							})
						}}
						searchable={true}
					/>
					<ClientSideError id="creator-error" error={clientSideErrors?.fields?.creator}></ClientSideError>
				</div>
				<div className="form-group">
					<label>{D1.contributor}</label>
					<ReactSelect
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.contributor
						)}
						options={stampListOptions}
						onChange={({ value }) =>
							setCodelist({ ...codelist, contributor: value })
						}
						isDisabled={true}
					/>
				</div>
				<div className="form-group">
					<LabelRequired htmlFor="disseminationStatus">
						{D1.disseminationStatusTitle}
					</LabelRequired>
					<Select
						className="form-control"
						placeholder={D1.disseminationStatusPlaceholder}
						value={disseminationStatusListOptions.find(
							({ value }) => value === codelist.disseminationStatus
						)}
						options={disseminationStatusListOptions}
						onChange={(value) => {
							setCodelist({ ...codelist, disseminationStatus: value });
							setClientSideErrors({
								...clientSideErrors,
								errorMessage: []
							})
						}}
						searchable={true}
					/>
					<ClientSideError id="disseminationStatus-error" error={clientSideErrors?.fields?.disseminationStatus}></ClientSideError>

				</div>
				<div className="row">
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
						<textarea
							type="text"
							value={codelist.descriptionLg1}
							className="form-control"
							id="descriptionLg1"
							name="descriptionLg1"
							onChange={handleChange}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<textarea
							type="text"
							value={codelist.descriptionLg2}
							className="form-control"
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</div>
				<div>
					{parentCodes && (
						<Picker
							panelTitle={D.codelistPartialTitle}
							codes={parentCodes}
							addAll={addAllClickHandler}
							removeAll={removeAllClickHandler}
							addAction={addClickHandler}
							removeAction={removeClickHandler}
						/>
					)}
				</div>
			</form>
		</React.Fragment>
	);
};

DumbCodelistPartialDetailEdit.propTypes = {
	component: PropTypes.object,
	disseminationStatusListOptions: PropTypes.array,
	stampListOptions: PropTypes.array,
	globalCodeListOptions: PropTypes.array,
	handleSave: PropTypes.func,
	handleBack: PropTypes.func,
	updateMode: PropTypes.bool,
	secondLang: PropTypes.bool,
};

DumbCodelistPartialDetailEdit.defaultProps = {
	disseminationStatusListOptions: [],
	stampListOptions: [],
	globalCodeListOptions: [],
};

export const CodeListPartialDetailEdit =
	Stores.DisseminationStatus.withDisseminationStatusListOptions(
		DumbCodelistPartialDetailEdit
	);
