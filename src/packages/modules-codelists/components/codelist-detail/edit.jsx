import { useState, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { validateCodelist } from '../../utils';
import D, { D1, D2 } from '../../i18n/build-dictionary';
import './edit.scss';
import MainDictionary from '../../../deprecated-locales/build-dictionary';
import { CodesCollapsiblePanel } from './codes-panel';
import {
	TextInput,
	Row,
	ContributorsInput,
	DisseminationStatusInput,
	ErrorBloc,
	GlobalClientSideErrorBloc,
	ClientSideError,
} from '../../../components';
import { Select } from '../../../components/select-rmes';
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
export const DumbCodelistDetailEdit = ({
	codelist: initialCodelist,
	handleSave,
	handleBack,
	updateMode,
	stampListOptions = [],
	serverSideError,
}) => {
	const [codelist, setCodelist] = useState(defaultCodelist);
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useTitle(D.codelistsTitle, codelist?.labelLg1);

	const permission = usePermission();
	const stamp = permission?.stamp;
	const isContributor =
		permission?.roles?.includes(CODELIST_CONTRIBUTOR) &&
		!permission?.roles?.includes(ADMIN);

	useEffect(() => {
		let codesList = { ...initialCodelist, ...defaultCodelist };

		if (!codesList.id) {
			codesList.contributor = isContributor ? [stamp] : ['DG75-L201'];
		}

		setCodelist(codesList);
	}, [initialCodelist, isContributor, stamp]);

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
		[clientSideErrors, codelist],
	);

	const handleSaveClick = useCallback(() => {
		const clientSideErrors = validateCodelist(codelist);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			handleSave(codelist);
		}
	}, [codelist, handleSave]);

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
						<LabelRequired htmlFor="lastListUriSegment">
							{D1.lastListUriSegmentTitle}
						</LabelRequired>
						<TextInput
							id="lastListUriSegment"
							name="lastListUriSegment"
							onChange={handleChange}
							value={codelist.lastListUriSegment || ''}
							disabled={updateMode && codelist.lastListUriSegment !== ''}
							aria-invalid={!!clientSideErrors.fields?.lastListUriSegment}
							aria-describedby={
								clientSideErrors.fields?.lastListUriSegment
									? 'lastListUriSegment-error'
									: null
							}
						/>
						<ClientSideError
							id="lastListUriSegment-error"
							error={clientSideErrors?.fields?.lastListUriSegment}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="lastCodeUriSegment">
							{D1.lastCodeUriSegmentTitle}
						</LabelRequired>
						<TextInput
							id="lastCodeUriSegment"
							name="lastCodeUriSegment"
							onChange={handleChange}
							value={codelist.lastCodeUriSegment || ''}
							disabled={updateMode && codelist.lastCodeUriSegment !== ''}
							aria-invalid={!!clientSideErrors.fields?.lastCodeUriSegment}
							aria-describedby={
								clientSideErrors.fields?.lastCodeUriSegment
									? 'lastCodeUriSegment-error'
									: null
							}
						/>
						<ClientSideError
							id="lastCodeUriSegment-error"
							error={clientSideErrors?.fields?.lastCodeUriSegment}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="lastClassUriSegment">
							{D1.lastClassUriSegmentTitle}
						</LabelRequired>
						<TextInput
							id="lastClassUriSegment"
							name="lastClassUriSegment"
							onChange={handleChange}
							value={codelist.lastClassUriSegment || ''}
							disabled={updateMode && codelist.lastClassUriSegment !== ''}
							aria-invalid={!!clientSideErrors.fields?.lastClassUriSegment}
							aria-describedby={
								clientSideErrors.fields?.lastClassUriSegment
									? 'lastClassUriSegment-error'
									: null
							}
						/>
						<ClientSideError
							id="lastClassUriSegment-error"
							error={clientSideErrors?.fields?.lastClassUriSegment}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="id">{D1.idTitle}</LabelRequired>
						<TextInput
							id="id"
							name="id"
							value={codelist.id || ''}
							onChange={handleChange}
							aria-invalid={!!clientSideErrors.fields?.id}
							aria-describedby={clientSideErrors.fields?.id ? 'id-error' : null}
						/>
						<ClientSideError
							id="id-error"
							error={clientSideErrors?.fields?.id}
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
								clientSideErrors.fields?.labelLg1 ? 'labelLg1-error' : null
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
								clientSideErrors.fields?.labelLg2 ? 'labelLg2-error' : null
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
							({ value }) => value === codelist.creator,
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
						handleChange={(values) => {
							setCodelist({ ...codelist, contributor: values });
						}}
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
			</form>
			{updateMode && (
				<CodesCollapsiblePanel codelist={codelist} editable={true} />
			)}
		</>
	);
};
