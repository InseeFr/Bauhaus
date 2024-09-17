import { useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import Picker from './picker';
import { validatePartialCodelist, partialInGlobalCodes } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import '../codelist-detail/edit.scss';
import MainDictionary from '../../../deprecated-locales/build-dictionary';
import {
	TextInput,
	Row,
	ContributorsInput,
	DisseminationStatusInput,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
	Select,
} from '../../../components';
import { CodeListApi } from '../../../sdk';
import { useTitle } from '../../../utils/hooks/useTitle';
import { ADMIN, CODELIST_CONTRIBUTOR } from '../../../auth/roles';
import { usePermission } from '../../../redux/hooks/usePermission';
import LabelRequired from '../../../components/label-required';
import { ActionToolbar } from '../../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../../components/buttons/buttons-with-icons';

const defaultCodelist = {
	created: dayjs(),
};
export const DumbCodelistPartialDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	updateMode,
	stampListOptions = [],
	globalCodeListOptions = [],
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	const [parentCodes, setParentCodes] = useState([]);
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useTitle(
		D.codelistsPartialTitle,
		codelist?.labelLg1 || D.codelistsCreateTitle
	);

	const handleParentCode = useCallback(
		(code) => {
			CodeListApi.getCodesListCodes(code, 1, 0).then((codes) => {
				const globalWithPartialCodes =
					partialInGlobalCodes(
						Object.values(codes.items || {}),
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

	const permission = usePermission();
	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(CODELIST_CONTRIBUTOR) &&
		!permission?.roles?.includes(ADMIN);

	useEffect(() => {
		let codesList = { ...initialCodelist, ...defaultCodelist };

		if (!codesList.id) {
			codesList.contributor = isContributor ? stamp : 'DG75-L201';
		}

		setCodelist(codesList);
		if (initialCodelist.parentCode) {
			handleParentCode(initialCodelist.parentCode);
		} else {
			setParentCodes([]);
		}
	}, [initialCodelist, isContributor, stamp, handleParentCode]);

	const handleChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setClientSideErrors({
				...clientSideErrors,
				errorMessage: [],
			});

			setCodelist({
				...codelist,
				[name]: value,
			});
		},
		[clientSideErrors, codelist]
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

		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			handleSave(codelist, parentCodes);
		}
	}, [codelist, parentCodes, handleSave]);

	return (
		<>
			<ActionToolbar>
				<CancelButton action={handleBack} col={3} />
				<SaveButton
					disabled={clientSideErrors.errorMessage?.length > 0}
					action={handleSaveClick}
					col={3}
				/>
			</ActionToolbar>
			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
					D={D}
				/>
			)}
			{serverSideError && (
				<ErrorBloc error={serverSideError} D={MainDictionary} />
			)}
			<form>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="id">{D1.idTitle}</LabelRequired>
						<TextInput
							id="id"
							name="id"
							value={codelist.id || ''}
							onChange={handleChange}
							disabled={updateMode}
							aria-invalid={!!clientSideErrors.fields?.id}
							aria-describedby={
								!!clientSideErrors.fields?.id ? 'id-error' : null
							}
						/>
						<ClientSideError
							id="id-error"
							error={clientSideErrors?.fields?.id}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="parentCode">
							{D1.parentCodelist}
						</LabelRequired>
						<Select
							placeholder={D1.parentCodelistPlaceholder}
							value={globalCodeListOptions?.find(
								({ value }) => value === codelist.parentCode
							)}
							options={globalCodeListOptions}
							onChange={handleParent}
							searchable={true}
							disabled={updateMode}
						/>
						<ClientSideError
							id="parentCode-error"
							error={clientSideErrors?.fields?.parentCode}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">{D1.labelTitle}</LabelRequired>
						<TextInput
							id="labelLg1"
							name="labelLg1"
							onChange={handleChange}
							value={codelist.labelLg1 || ''}
							aria-invalid={!!clientSideErrors.fields?.labelLg1}
							aria-describedby={
								!!clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
							}
						/>
						<ClientSideError
							id="labelLg1-error"
							error={clientSideErrors?.fields?.labelLg1}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.labelTitle}</LabelRequired>
						<TextInput
							id="labelLg2"
							name="labelLg2"
							onChange={handleChange}
							value={codelist.labelLg2 || ''}
							aria-invalid={!!clientSideErrors.fields?.labelLg2}
							aria-describedby={
								!!clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
							}
						/>
						<ClientSideError
							id="labelLg2-error"
							error={clientSideErrors?.fields?.labelLg2}
						></ClientSideError>
					</div>
				</Row>
				<div className="form-group">
					<LabelRequired htmlFor="creator">{D1.creator}</LabelRequired>
					<Select
						placeholder={D1.stampsPlaceholder}
						value={stampListOptions.find(
							({ value }) => value === codelist.creator
						)}
						options={stampListOptions}
						onChange={(value) => {
							setCodelist({ ...codelist, creator: value });
							setClientSideErrors({
								...clientSideErrors,
								errorMessage: [],
							});
						}}
						searchable={true}
					/>
					<ClientSideError
						id="creator-error"
						error={clientSideErrors?.fields?.creator}
					></ClientSideError>
				</div>
				<div className="form-group">
					<ContributorsInput
						stampListOptions={stampListOptions}
						value={codelist.contributor}
						handleChange={(values) =>
							setCodelist({ ...codelist, contributor: values })
						}
					/>
				</div>
				<div className="form-group">
					<DisseminationStatusInput
						value={codelist.disseminationStatus}
						handleChange={(value) => {
							setCodelist({ ...codelist, disseminationStatus: value });
							setClientSideErrors({
								...clientSideErrors,
								errorMessage: [],
							});
						}}
						required
					/>

					<ClientSideError
						id="disseminationStatus-error"
						error={clientSideErrors?.fields?.disseminationStatus}
					></ClientSideError>
				</div>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
						<textarea
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
							value={codelist.descriptionLg2}
							className="form-control"
							id="descriptionLg2"
							name="descriptionLg2"
							onChange={handleChange}
						/>
					</div>
				</Row>
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
		</>
	);
};
