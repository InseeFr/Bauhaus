import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { D1, D2 } from '../../deprecated-locales';
import { default as ReactSelect } from 'react-select';
import D from '../../deprecated-locales/build-dictionary';
import { useDatasetsForDistributions, useDistribution } from '../datasets';
import { validate } from './validation';
import {
	TextInput,
	Loading,
	Row,
	ClientSideError,
	GlobalClientSideErrorBloc,
	PageTitleBlock,
	NumberInput,
	UrlInput,
} from '../../components';
import { EditorMarkdown } from '../../components/rich-editor/editor-markdown';
import { useGoBack } from '../../utils/hooks/useGoBack';
import { useTitle } from '../../utils/hooks/useTitle';
import { DistributionApi } from '../../sdk';
import LabelRequired from '../../components/label-required';
import { ActionToolbar } from '../../components/action-toolbar';
import {
	CancelButton,
	SaveButton,
} from '../../components/buttons/buttons-with-icons';

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

	const queryClient = useQueryClient();

	const { isPending: isSaving, mutate: save } = useMutation({
		mutationFn: () => {
			if (isEditing) {
				return DistributionApi.putDistribution(editingDistribution);
			}
			return DistributionApi.postDistribution(editingDistribution);
		},

		onSuccess: (id) => {
			if (isEditing) {
				queryClient.invalidateQueries(['distributions', id]);
			}
			queryClient.invalidateQueries(['distributions']);

			goBack(`/datasets/distributions/${id}`, !isEditing);
		},
	});

	useTitle(D.distributionsTitle, editingDistribution?.labelLg1);

	if (!distribution && isEditing) {
		return <Loading />;
	}
	if (isSaving) {
		return <Loading textType="saving" />;
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
					secondLang={true}
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
					D={D}
				/>
			)}
			<form>
				<Row>
					<div className="col-md-12 form-group">
						<LabelRequired htmlFor="idDataset">{D1.datasetTitle}</LabelRequired>
						<ReactSelect
							placeholder={D1.datasetTitle}
							value={datasetsOptions.find(
								({ value }) => value === editingDistribution.idDataset,
							)}
							options={datasetsOptions}
							onChange={(choice) => {
								setEditingDistribution({
									...editingDistribution,
									idDataset: choice?.value,
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
						<EditorMarkdown
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
						<EditorMarkdown
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
					<div className="col-md-12 form-group">
						<label htmlFor="taille">{D1.tailleTitle}</label>
						<NumberInput
							id="taille"
							value={editingDistribution.taille}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									taille: e.target.value,
								})
							}
						/>
					</div>
				</Row>
				<Row>
					<div className="col-md-12 form-group">
						<label htmlFor="url">{D1.downloadUrlTitle}</label>
						<UrlInput
							id="url"
							value={editingDistribution.url}
							onChange={(e) =>
								setEditingDistribution({
									...editingDistribution,
									url: e.target.value,
								})
							}
						/>
					</div>
				</Row>
			</form>
		</div>
	);
};
