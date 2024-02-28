import D, { D1, D2 } from '../../../i18n/build-dictionary';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/datasets-api';
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
	Auth,
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
import { withCodesLists } from '../../../hooks/hooks';
import { StructureAPI } from 'bauhaus-structures';
import { TemporalField } from './components/temporalField';
import { useDataset } from '../hooks';
import { useSelector } from 'react-redux';

const convertCodesListsToSelectOption = (codesList) =>
	codesList?.codes?.map((code) => ({
		value: code.iri,
		label: code.labelLg1,
	})) ?? [];

const Dataset = (props) => {
	const [archivageUnits, setArchivageUnits] = useState([]);

	useEffect(() => {
		api.getArchivageUnits().then(setArchivageUnits);
	}, []);

	const clAccessRightsOptions = convertCodesListsToSelectOption(
		props['CL_ACCESS_RIGHTS']
	);
	const clFreqOptions = convertCodesListsToSelectOption(props['CL_FREQ']);
	const clConfStatusOptions = convertCodesListsToSelectOption(
		props['CL_CONF_STATUS']
	);
	const clDataTypes = convertCodesListsToSelectOption(props['CL_DATA_TYPES']);
	const clStatUnit = convertCodesListsToSelectOption(props['CL_STAT_UNIT']);
	const clProcessStep = convertCodesListsToSelectOption(
		props['CL_PROCESS_STEP']
	);
	const clGeo = convertCodesListsToSelectOption(props['CL_GEO']);
	const clGeoType = convertCodesListsToSelectOption(props['CL_TYPE_GEO']);

	const { data: organisations } = useQuery({
		queryFn: () => {
			return apiOrganisations.getOrganisations();
		},
		queryKey: ['organisations'],
	});

	const { data: structures } = useQuery({
		queryKey: ['structures'],
		queryFn: () => {
			return StructureAPI.getStructures();
		},
	});

	const structuresOptions =
		structures?.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })) ??
		[];

	const organisationsOptions =
		organisations?.map(({ id, label }) => ({ value: id, label })) ?? [];

	const layoutConfiguration = {
		globalInformation: {
			title: D.globalInformationsTitle,
			children: {
				globalInformation: {
					title: D.globalInformationsTitle,
					content: () => {
						if (editingDataset?.updated) {
							editingDataset.updated = editingDataset.updated.substring(
								0,
								(editingDataset.updated = editingDataset.update.indexOf('T'))
							);
						}
						if (editingDataset?.issued) {
							editingDataset.issued = editingDataset.issued.substring(
								0,
								(editingDataset.updated = editingDataset.update.indexOf('T'))
							);
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
									<div className="col-md-6 form-group">
										<label htmlFor="subtitleLg1">{D1.datasetsSubtitle}</label>
										<input
											type="text"
											className="form-control"
											id="subtitleLg1"
											value={editingDataset.subTitleLg1}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													subTitleLg1: e.target.value,
												});
											}}
										/>
									</div>
									<div className="col-md-6 form-group">
										<label htmlFor="subtitleLg2">{D2.datasetsSubtitle}</label>
										<input
											type="text"
											className="form-control"
											id="subtitleLg2"
											value={editingDataset.subTitleLg2}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													subTitleLg2: e.target.value,
												});
											}}
										/>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsUpdatedDate}
											<input
												type="date"
												className="form-control"
												value={editingDataset.updated}
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
											{D1.datasetsFirstDiffusion}
											<input
												type="date"
												className="form-control"
												value={editingDataset.issued}
												onChange={(e) => {
													setEditingDataset({
														...editingDataset,
														issued: e.target.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsAccessRights}
											<ReactSelect
												value={editingDataset.accessRights}
												options={clAccessRightsOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														accessRights: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsUpdateFrequency}
											<ReactSelect
												value={editingDataset.accrualPeriodicity}
												options={clFreqOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														accrualPeriodicity: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsConfidentialityStatus}
											<ReactSelect
												value={editingDataset.confidentialityStatus}
												options={clConfStatusOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														confidentialityStatus: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsSpacialCoverage}
											<ReactSelect
												value={editingDataset.spacialCoverage}
												options={clGeo}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														spacialCoverage: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsSpacialResolutions}
											<ReactSelect
												value={editingDataset.spacialResolutions}
												options={clGeoType}
												multi={true}
												onChange={(values) => {
													setEditingDataset({
														...editingDataset,
														spacialResolutions: values.map(
															({ value }) => value
														),
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 from-group ">
										<label htmlFor="observationNumber">
											{D1.datasetsNumberObservations}
										</label>
										<input
											type="number"
											className="form-control"
											id="observationNumber"
											value={editingDataset.observationNumber}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													observationNumber: e.target.value,
												});
											}}
										/>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 from-group ">
										<label htmlFor="timeSeriesNumber">
											{D1.datasetsNumberTimeSeries}
										</label>
										<input
											type="number"
											className="form-control"
											id="timeSeriesNumber"
											value={editingDataset.timeSeriesNumber}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													timeSeriesNumber: e.target.value,
												});
											}}
										/>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsDataProvider}
											<ReactSelect
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
											{D1.datasetsPublicationProvider}
											<ReactSelect
												unclearable
												value={editingDataset.publisher}
												options={organisationsOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														publisher: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<LabelRequired>{D1.generatedBy}</LabelRequired>
										<ReactSelect
											unclearable
											multi={false}
											value={editingDataset.idSerie}
											options={seriesOptions}
											onChange={(option) => {
												setEditingDataset({
													...editingDataset,
													idSerie: option?.value,
												});
												setClientSideErrors({});
											}}
										/>
										<ClientSideError
											error={clientSideErrors?.fields?.idSerie}
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
								<Row>
									<div className="col-md-6 form-group">
										<label htmlFor="landingPageLg1">
											{D1.datasetsLandingPage}
										</label>
										<input
											type="text"
											className="form-control"
											id="landingPageLg1"
											value={editingDataset.landingPageLg1}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													landingPageLg1: e.target.value,
												});
											}}
										/>
									</div>
									<div className="col-md-6 form-group">
										<label htmlFor="landingPageLg2">
											{D2.datasetsLandingPage}
										</label>
										<input
											type="text"
											className="form-control"
											id="landingPageLg2"
											value={editingDataset.landingPageLg2}
											onChange={(e) => {
												setEditingDataset({
													...editingDataset,
													landingPageLg2: e.target.value,
												});
											}}
										/>
									</div>
								</Row>
							</>
						);
					},
				},
				globalInternalManagementTitle: {
					title: D.globalInternalManagementTitle,
					content: () => {
						return (
							<>
								<Row>
									<div className="col-md-12 form-group">
										<LabelRequired>{D1.creatorTitle}</LabelRequired>
										<ReactSelect
											unclearable
											multi={false}
											value={editingDataset.catalogRecord?.creator}
											options={stampsOptions}
											onChange={(option) => {
												setEditingDataset({
													...editingDataset,
													catalogRecord: {
														...(editingDataset.catalogRecord ?? {}),
														creator: option?.value,
													},
												});
												setClientSideErrors((clientSideErrors) => ({
													...clientSideErrors,
													errorMessage: [],
												}));
											}}
										/>
										<ClientSideError
											error={clientSideErrors?.fields?.creator}
										></ClientSideError>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<LabelRequired>{D1.contributorTitle}</LabelRequired>
										<ReactSelect
											unclearable
											multi={false}
											value={editingDataset.catalogRecord?.contributor}
											options={stampsOptions}
											onChange={(option) => {
												setEditingDataset({
													...editingDataset,
													catalogRecord: {
														...(editingDataset.catalogRecord ?? {}),
														contributor: option?.value,
													},
												});
												setClientSideErrors((clientSideErrors) => ({
													...clientSideErrors,
													errorMessage: [],
												}));
											}}
										/>
										<ClientSideError
											error={clientSideErrors?.fields?.contributor}
										></ClientSideError>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<LabelRequired>{D1.disseminationStatusTitle}</LabelRequired>
										<ReactSelect
											unclearable
											multi={false}
											value={editingDataset.disseminationStatus}
											options={disseminationStatusOptions}
											onChange={(option) => {
												setEditingDataset({
													...editingDataset,
													disseminationStatus: option?.value,
												});
												setClientSideErrors({});
											}}
										/>
										<ClientSideError
											error={clientSideErrors?.fields?.disseminationStatus}
										></ClientSideError>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetProcessStep}
											<ReactSelect
												unclearable
												multi={false}
												value={editingDataset.processStep}
												options={clProcessStep}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														processStep: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsArchiveUnit}
											<ReactSelect
												unclearable
												value={editingDataset.archiveUnit}
												options={archivageUnits}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														archiveUnit: option?.value,
													});
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
					content: () => {
						return (
							<>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsType}
											<ReactSelect
												value={editingDataset.type}
												options={clDataTypes}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														type: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>
								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsStatisticalUnits}
											<ReactSelect
												value={editingDataset.statisticalUnit}
												multi={true}
												options={clStatUnit}
												onChange={(values) => {
													setEditingDataset({
														...editingDataset,
														statisticalUnit: values.map(({ value }) => value),
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsDataStructure}
											<ReactSelect
												value={editingDataset.dataStructure}
												options={structuresOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														dataStructure: option?.value,
													});
												}}
											/>
										</label>
									</div>
								</Row>

								<Row>
									<TemporalField
										temporalCoverageDataType={
											editingDataset.temporalCoverageDataType
										}
										temporalCoverageStartDate={
											editingDataset.temporalCoverageStartDate
										}
										temporalCoverageEndDate={
											editingDataset.temporalCoverageEndDate
										}
										updateTemporalCoverage={(temporalCoverage) => {
											setEditingDataset({
												...editingDataset,
												...temporalCoverage,
											});
										}}
									/>
								</Row>

								<Row>
									<div className="col-md-12 form-group">
										<label className="w-100 wilco-label-required">
											{D1.datasetsTemporalResolution}
											<ReactSelect
												value={editingDataset.temporalResolution}
												options={clFreqOptions}
												onChange={(option) => {
													setEditingDataset({
														...editingDataset,
														temporalResolution: option?.value,
													});
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

	const { data: dataset, status } = useDataset(id);

	const permission = useSelector(Auth.getPermission);
	const stamp = permission?.stamp;
	const isContributor = permission?.roles?.includes(Auth.DATASET_CONTRIBUTOR) && !permission?.roles?.includes(Auth.ADMIN);

	useEffect(() => {
		if (status === 'success') {
			setEditingDataset(dataset);
		} else if(isContributor && !id){
			setEditingDataset({
				catalogRecord: {
					contributor: stamp
				}
			})
		}
	}, [status, dataset, id, isContributor, stamp]);

	const queryClient = useQueryClient();

	const { isLoading: isSaving, mutate: save } = useMutation(
		(id) => {
			const formattedDataset = { themes: [], ...editingDataset };
			if (isEditing) {
				return api.putDataset(formattedDataset);
			}
			return api.postDataset(formattedDataset);
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

export const DatasetEdit = withCodesLists([
	'CL_ACCESS_RIGHTS',
	'CL_FREQ',
	'CL_CONF_STATUS',
	'CL_DATA_TYPES',
	'CL_STAT_UNIT',
	'CL_PROCESS_STEP',
	'CL_GEO',
	'CL_TYPE_GEO',
])(Dataset);
