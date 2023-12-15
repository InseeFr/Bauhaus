import D, { D1, D2 } from '../../../i18n/build-dictionary';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../remote-api/datasets-api';
import operationSeries from '../../../remote-api/operations-api';
import './edit.scss';

import {
	ActionToolbar,
	CancelButton,
	goBack,
	goBackOrReplace,
	LabelRequired,
	Loading,
	SaveButton,
} from '@inseefr/wilco';
import {
	ClientSideError,
	EditorMarkdown,
	GlobalClientSideErrorBloc,
	PageTitleBlock,
	Row,
	StampsApi,
	Stores,
} from 'bauhaus-utilities';
import ReactSelect from 'react-select';
import { useThemes } from './useThemes';
import { validate } from './validation';
import { LayoutWithLateralMenu } from './layout-with-lateral-menu';
import apiOrganisations from '../../../remote-api/organisations-api';

export const DatasetEdit = (props) => {
	const { data: organisations } = useQuery({
		queryFn: () => {
			return apiOrganisations.getOrganisations();
		},
		queryKey: ['organisations'],
	});

	const organisationsOptions =
		organisations?.map(({ id, label }) => ({ value: id, label })) ?? [];

	const layoutConfiguration = {
		globalInformation: {
			title: D.globalInformationsTitle,
			children: {
				globalInformation: {
					title: D.globalInformationsTitle,
					content: () => {
						let formattedUpdatedDate = '';
						if (dataset?.updated) {
							const d = new Date(editingDataset.updated);
							formattedUpdatedDate = `${d.getFullYear()}-${
								d.getMonth() + 1
							}-${d.getDate()}`;
						}
						return (
							<>
								<Row>
									<div className="col-md-6 form-group">
										<LabelRequired htmlFor="labelLg1">{D1.title}</LabelRequired>
										<input
											type="text"
											className="form-control"
											id="labelLg1"
											value={editingDataset.labelLg1}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
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
										<input
											type="text"
											className="form-control"
											id="labelLg2"
											value={editingDataset.labelLg2}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
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
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsUpdatedDate}
											<input
												type="date"
												className="form-control"
												value={formattedUpdatedDate}
												onChange={(e) => {
													setEditingDataset({
														...editingDataset,
														updated: e.target.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.creatorTitle}
											<span className="asterisk">*</span>
											<ReactSelect
												placeholder={D1.stampsPlaceholder}
												unclearable
												multi={false}
												value={editingDataset.catalogRecord?.creator}
												options={stampsOptions}
												onChange={({ value }) => {
													setEditingDataset({
														...editingDataset,
														catalogRecord: {
															...(editingDataset.catalogRecord ?? {}),
															creator: value,
														},
													});
													setClientSideErrors((clientSideErrors) => ({
														...clientSideErrors,
														errorMessage: [],
													}));
												}}
											/>
										</label>
										<ClientSideError
											error={clientSideErrors?.fields?.creator}
										></ClientSideError>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.contributorTitle}
											<span className="asterisk">*</span>
											<ReactSelect
												unclearable
												multi={false}
												value={editingDataset.catalogRecord?.contributor}
												options={stampsOptions}
												onChange={({ value }) => {
													setEditingDataset({
														...editingDataset,
														catalogRecord: {
															...(editingDataset.catalogRecord ?? {}),
															contributor: value,
														},
													});
													setClientSideErrors((clientSideErrors) => ({
														...clientSideErrors,
														errorMessage: [],
													}));
												}}
											/>
										</label>
										<ClientSideError
											error={clientSideErrors?.fields?.contributor}
										></ClientSideError>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsDataProvider}
											<ReactSelect
												placeholder={D1.stampsPlaceholder}
												unclearable
												multi={true}
												value={editingDataset.creators}
												options={organisationsOptions}
												onChange={(values) => {
													setEditingDataset({
														...editingDataset,
														creators: values.map((v) => v.value),
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.generatedBy}
											<span className="asterisk">*</span>
											<ReactSelect
												unclearable
												multi={false}
												value={editingDataset.idSerie}
												options={seriesOptions}
												onChange={({ value }) => {
													setEditingDataset({
														...editingDataset,
														idSerie: value,
													});
													setClientSideErrors({});
												}}
											/>
										</label>
										<ClientSideError
											error={clientSideErrors?.fields?.idSerie}
										></ClientSideError>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.disseminationStatusTitle}
											<span className="asterisk">*</span>
											<ReactSelect
												unclearable
												multi={false}
												value={editingDataset.disseminationStatus}
												options={disseminationStatusOptions}
												onChange={({ value }) => {
													setEditingDataset({
														...editingDataset,
														disseminationStatus: value,
													});
													setClientSideErrors({});
												}}
											/>
										</label>
										<ClientSideError
											error={clientSideErrors?.fields?.disseminationStatus}
										></ClientSideError>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.theme}
											<ReactSelect
												unclearable
												multi={true}
												value={editingDataset.themes}
												options={themesOptions}
												onChange={(values) => {
													setEditingDataset({
														...editingDataset,
														themes: values.map(({ value }) => value),
													});
													setClientSideErrors({});
												}}
											/>
										</label>
									</div>
								</Row>
							</>
						);
					},
				},
			},
		},
		notes: {
			title: D.notesTitle,
			children: {
				notes: {
					title: D.notesTitle,
					content: () => (
						<>
							<Row>
								<div className="col-md-6 form-group">
									<label htmlFor="descriptionLg1">{D1.descriptionTitle}</label>
									<EditorMarkdown
										text={editingDataset.descriptionLg1}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												descriptionLg1: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
								<div className="col-md-6 form-group">
									<label htmlFor="descriptionLg2">{D2.descriptionTitle}</label>
									<EditorMarkdown
										text={editingDataset.descriptionLg2}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												descriptionLg2: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
							</Row>
							<Row>
								<div className="col-md-6 form-group">
									<label htmlFor="descriptionLg1">{D1.datasetsAbstract}</label>
									<EditorMarkdown
										text={editingDataset.abstractLg1}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												abstractLg1: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
								<div className="col-md-6 form-group">
									<label htmlFor="descriptionLg2">{D2.datasetsAbstract}</label>
									<EditorMarkdown
										text={editingDataset.abstractLg2}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												abstractLg2: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
							</Row>
							<Row>
								<div className="col-md-6 form-group">
									<label htmlFor="descriptionLg1">{D1.datasetsCaution}</label>
									<EditorMarkdown
										text={editingDataset.cautionLg1}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												cautionLg1: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
								<div className="col-md-6 form-group">
									<label htmlFor="cautionLg2">{D2.datasetsAbstract}</label>
									<EditorMarkdown
										text={editingDataset.cautionLg2}
										handleChange={(value) => {
											setEditingDataset({
												...editingDataset,
												cautionLg2: value,
											});
											setClientSideErrors((clientSideErrors) => ({
												...clientSideErrors,
												errorMessage: [],
											}));
										}}
									/>
								</div>
							</Row>
						</>
					),
				},
			},
		},
		staticsInformations: {
			title: D.staticsInformations,
			children: {
				staticsInformations: {
					title: D.staticsInformations,
					content: () => <></>,
				},
			},
		},
	};
	const { id } = useParams();
	const isEditing = !!id;

	const [editingDataset, setEditingDataset] = useState({});
	const [clientSideErrors, setClientSideErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const { data: stampsOptions = [] } = useQuery(['stamps'], () => {
		return StampsApi.getStamps().then((stamps) =>
			stamps.map((stamp) => ({
				value: stamp,
				label: stamp,
			}))
		);
	});

	const { data: themesOptions = [] } = useThemes();

	const { data: seriesOptions = [] } = useQuery(['series'], () => {
		return operationSeries.getSeriesList().then((stamps) =>
			stamps.map((serie) => ({
				value: serie.id,
				label: serie.label,
			}))
		);
	});

	const { data: disseminationStatusOptions = [] } = useQuery(
		['dissemination-status'],
		() => {
			return Stores.DisseminationStatus.api
				.getDisseminationStatus()
				.then((status) =>
					status.map((d) => ({
						value: d.url,
						label: d.label,
					}))
				);
		}
	);

	const { data: dataset, status } = useQuery({
		enabled: isEditing,
		queryKey: ['datasets', id],
		queryFn: () => api.getById(id),
	});

	useEffect(() => {
		if (status === 'success') {
			setEditingDataset(dataset);
		}
	}, [status, dataset]);

	const queryClient = useQueryClient();

	const { isLoading: isSaving, mutate: save } = useMutation(
		(id) => {
			if (isEditing) {
				return api.putDataset({ themes: [], ...editingDataset });
			} else {
				return api.postDataset({ themes: [], ...editingDataset });
			}
		},
		{
			onSuccess: (id) => {
				if (isEditing) {
					queryClient.invalidateQueries(['datasets', id]);
				}

				goBackOrReplace(props, `/datasets/${id}`, !isEditing);
			},
		}
	);

	if (!dataset && isEditing) {
		return <Loading />;
	}
	if (isSaving) {
		return <Loading textType="saving" />;
	}

	const onSubmit = () => {
		const clientSideErrors = validate(editingDataset);
		if (clientSideErrors.errorMessage?.length > 0) {
			setSubmitting(true);
			setClientSideErrors(clientSideErrors);
		} else {
			setClientSideErrors({});
			save(editingDataset);
		}
	};

	const allChildrenItems = Object.values(layoutConfiguration).reduce(
		(acc, configuration) => {
			return {
				...acc,
				...configuration.children,
			};
		},
		{}
	);

	return (
		<div className="editor-container dataset-container">
			{isEditing && (
				<PageTitleBlock
					titleLg1={dataset.labelLg1}
					titleLg2={dataset.labelLg2}
					secondLang={true}
				/>
			)}

			<ActionToolbar>
				<CancelButton action={goBack(props, '/datasets')} />
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
				<LayoutWithLateralMenu layoutConfiguration={layoutConfiguration}>
					{(key) => allChildrenItems[key].content()}
				</LayoutWithLateralMenu>
			</form>
		</div>
	);
};
