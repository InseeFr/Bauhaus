import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ActionToolbar } from '@components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '@components/buttons/buttons-with-icons';
import {
	ClientSideError,
	ErrorBloc,
	GlobalClientSideErrorBloc,
} from '@components/errors-bloc';
import { TextInput, UrlInputBlock } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Loading, Saving } from '@components/loading';
import { PageTitleBlock } from '@components/page-title-block';
import { MDEditor } from '@components/rich-editor/react-md-editor';
import { Select } from '@components/select-rmes';

import { useGoBack } from '@utils/hooks/useGoBack';
import { useTitle } from '@utils/hooks/useTitle';

import { D1, D2 } from '../../deprecated-locales';
import D from '../../deprecated-locales/build-dictionary';
import {
	useCreateOrUpdateDistribution,
	useDatasetsForDistributions,
	useDistribution,
} from '../datasets';
import { ByteSizeInput } from './edit/byte-size-input';
import { validate } from './validation';

export const Component = () => {
	const { id } = useParams();
	const isEditing = !!id;

	const goBack = useGoBack();

	const [editingDistribution, setEditingDistribution] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const { data: distribution, status } = useDistribution(id);
	const { data: datasets } = useDatasetsForDistributions();

	useEffect(() => {
		if (status === 'success') {
			setEditingDistribution(distribution);
		}
	}, [status, distribution]);

	const datasetsOptions =
		datasets?.map((dataset) => ({
			value: dataset.id,
			label: dataset.label,
		})) ?? [];

	const langOptions = [
		{
			value: 'fr',
			label: 'Français',
		},
		{ value: 'en', label: 'Anglais' },
	];

	const { isSaving, save, serverSideError } = useCreateOrUpdateDistribution(
		isEditing,
		editingDistribution,
	);

	useTitle(D.distributionsTitle, editingDistribution?.labelLg1);

	if (!distribution && isEditing) {
		return <Loading />;
	}
	if (isSaving) {
		return <Saving />;
	}

	const onSubmit = () => {
		const clientSideErrors = validate(editingDistribution);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			save(editingDistribution);
		}
	};

	return (
		<div className="container editor-container">
			{isEditing && (
				<PageTitleBlock
					titleLg1={distribution.labelLg1}
					titleLg2={distribution.labelLg2}
				/>
			)}
			<ActionToolbar>
				<CancelButton action={() => goBack('/datasets/distributions')} />
				<SaveButton
					action={onSubmit}
					disabled={clientSideErrors.errorMessage?.length > 0}
				/>
			</ActionToolbar>
			{submitting && clientSideErrors && (
				<GlobalClientSideErrorBloc
					clientSideErrors={clientSideErrors.errorMessage}
				/>
			)}
			<ErrorBloc error={serverSideError} D={D} />
			<form>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="idDataset">{D1.datasetTitle}</LabelRequired>
						<Select
							placeholder={D1.datasetTitle}
							value={datasetsOptions.find(
								({ value }) => value === editingDistribution.idDataset,
							)}
							options={datasetsOptions}
							onChange={(value) => {
								setEditingDistribution({
									...editingDistribution,
									idDataset: value,
								});
								setClientSideErrors((clientSideErrors) => ({
									...clientSideErrors,
									errorMessage: [],
								}));
							}}
						/>
						<ClientSideError
							error={clientSideErrors?.fields?.idDataset}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg1">{D1.title}</LabelRequired>
						<TextInput
							id="labelLg1"
							value={editingDistribution.labelLg1}
							onChange={(e) => {
								setEditingDistribution({
									...editingDistribution,
									labelLg1: e.target.value,
								});
								setClientSideErrors((clientSideErrors) => ({
									...clientSideErrors,
									errorMessage: [],
								}));
							}}
						/>
						<ClientSideError
							error={clientSideErrors?.fields?.labelLg1}
						></ClientSideError>
					</div>
					<div className="col-md-6 form-group">
						<LabelRequired htmlFor="labelLg2">{D2.title}</LabelRequired>
						<TextInput
							id="labelLg2"
							value={editingDistribution.labelLg2}
							onChange={(e) => {
								setEditingDistribution({
									...editingDistribution,
									labelLg2: e.target.value,
								});
								setClientSideErrors((clientSideErrors) => ({
									...clientSideErrors,
									errorMessage: [],
								}));
							}}
						/>
						<ClientSideError
							error={clientSideErrors?.fields?.labelLg2}
						></ClientSideError>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
						<MDEditor
							text={editingDistribution.descriptionLg1}
							handleChange={(value) =>
								setEditingDistribution({
									...editingDistribution,
									descriptionLg1: value,
								})
							}
						/>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
						<MDEditor
							text={editingDistribution.descriptionLg2}
							handleChange={(value) =>
								setEditingDistribution({
									...editingDistribution,
									descriptionLg2: value,
								})
							}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="language">{D1.languageTitle}</label>
						<Select
							disabled={id !== undefined}
							value={editingDistribution.language}
							options={langOptions}
							onChange={(value) => {
								setEditingDistribution({
									...editingDistribution,
									language: value,
								});
							}}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="format">{D1.formatTitle}</label>
						<TextInput
							id="format"
							value={editingDistribution.format}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									format: e.target.value,
								})
							}
							list="format-list"
						/>
						<datalist id="format-list">
							<option value="CSV"></option>
							<option value="PARQUET"></option>
						</datalist>
					</div>
				</Row>
				<Row>
					<div className="col-md-6 form-group">
						<label htmlFor="mediaType">{D.mediaTypeTitle}</label>
						<TextInput
							id="mediaType"
							value={editingDistribution.mediaType}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									mediaType: e.target.value,
								})
							}
							list="mediaType-list"
						/>
						<datalist id="mediaType-list">
							<option value="CSV"></option>
							<option value="PARQUET"></option>
							<option value="XSLX"></option>
						</datalist>
					</div>
					<div className="col-md-6 form-group">
						<label htmlFor="compressFormat">{D.compressFormatTitle}</label>
						<TextInput
							id="compressFormat"
							value={editingDistribution.compressFormat}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									compressFormat: e.target.value,
								})
							}
							list="compressFormat-list"
						/>
						<datalist id="compressFormat-list">
							<option value="7Z"></option>
							<option value="TAR GZ"></option>
							<option value="ZIP"></option>
						</datalist>
					</div>
				</Row>
				<Row>
					<ByteSizeInput
						value={editingDistribution}
						onChange={setEditingDistribution}
					/>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<UrlInputBlock
							label={D.accessUrlTitle}
							value={editingDistribution.accessUrl}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									accessUrl: e.target.value,
								})
							}
							error={clientSideErrors?.fields?.accessUrl}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<UrlInputBlock
							label={D.downloadUrlTitle}
							value={editingDistribution.url}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									url: e.target.value,
								})
							}
							error={clientSideErrors?.fields?.url}
						/>
					</div>
				</Row>
			</form>
		</div>
	);
};
