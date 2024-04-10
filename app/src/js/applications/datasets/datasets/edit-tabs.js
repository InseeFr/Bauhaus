import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useThemes } from './useThemes';
import { withCodesLists } from 'js/hooks/hooks';

import { D1, D2 } from 'js/i18n';

import api from '../api/datasets-api';
import apiOrganisations from 'js/remote-api/organisations-api';
import operationSeries from 'js/remote-api/operations-api';

import ReactSelect from 'react-select';
import { LabelRequired } from '@inseefr/wilco';
import { StructureAPI } from 'bauhaus-structures';
import {
	ClientSideError,
	EditorMarkdown,
	Row,
	StampsApi,
	Stores,
} from 'bauhaus-utilities';
import { TemporalField } from './components/temporalField';

const convertCodesListsToSelectOption = (codesList) =>
	codesList?.codes?.map((code) => ({
		value: code.iri,
		label: code.labelLg1,
	})) ?? [];

const GlobalInformationTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const clFreqOptions = convertCodesListsToSelectOption(props['CL_FREQ']);

	const { data: organisations } = useQuery({
		queryFn: () => {
			return apiOrganisations.getOrganisations();
		},
		queryKey: ['organisations'],
	});
	const organisationsOptions =
		organisations?.map(({ iri, label }) => ({ value: iri, label })) ?? [];

	const { data: themesOptions = [] } = useThemes();

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
							}}
						/>
					</label>
				</div>
			</Row>
			<Row>
				<div className="col-md-6 form-group">
					<label htmlFor="landingPageLg1">{D1.datasetsLandingPage}</label>
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
					<label htmlFor="landingPageLg2">{D2.datasetsLandingPage}</label>
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
};

const InternalManagementTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const { data: stampsOptions = [] } = useQuery(['stamps'], () => {
		return StampsApi.getStamps().then((stamps) =>
			stamps.map((stamp) => ({
				value: stamp,
				label: stamp,
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

	const { data: seriesOptions = [] } = useQuery(['series'], () => {
		return operationSeries.getSeriesList().then((stamps) =>
			stamps.map((serie) => ({
				value: serie.id,
				label: serie.label,
			}))
		);
	});

	const clAccessRightsOptions = convertCodesListsToSelectOption(
		props['CL_ACCESS_RIGHTS']
	);

	const clConfStatusOptions = convertCodesListsToSelectOption(
		props['CL_CONF_STATUS']
	);

	const clProcessStep = convertCodesListsToSelectOption(
		props['CL_PROCESS_STEP']
	);

	const [archivageUnits, setArchivageUnits] = useState([]);
	useEffect(() => {
		api.getArchivageUnits().then(setArchivageUnits);
	}, []);

	return (
		<>
			<Row>
				<div className="col-md-12 form-group">
					<label htmlFor="altIdentifier">{D1.datasetsAltId}</label>
					<input
						type="text"
						className="form-control"
						id="altIdentifier"
						value={editingDataset.altIdentifier}
						onChange={(e) => {
							setEditingDataset({
								...editingDataset,
								altIdentifier: e.target.value,
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.altIdentifier}
					></ClientSideError>
				</div>
			</Row>

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
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.disseminationStatus}
					></ClientSideError>
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
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
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
};

export const Notes = ({ editingDataset, setEditingDataset }) => {
	return (
		<>
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
						}}
					/>
				</div>
			</Row>
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
						}}
					/>
				</div>
			</Row>
		</>
	);
};

const StaticsInformationsTab = ({
	editingDataset,
	setEditingDataset,
	...props
}) => {
	const clDataTypes = convertCodesListsToSelectOption(props['CL_DATA_TYPES']);

	const { data: structures } = useQuery({
		queryKey: ['structures'],
		queryFn: () => {
			return StructureAPI.getStructures();
		},
	});
	const structuresOptions =
		structures?.map(({ iri, labelLg1 }) => ({ value: iri, label: labelLg1 })) ??
		[];

	const clStatUnit = convertCodesListsToSelectOption(props['CL_STAT_UNIT']);

	const clFreqOptions = convertCodesListsToSelectOption(props['CL_FREQ']);

	const clGeo = convertCodesListsToSelectOption(props['CL_GEO']);

	const clGeoType = convertCodesListsToSelectOption(props['CL_TYPE_GEO']);

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
				<TemporalField
					temporalCoverageDataType={editingDataset.temporalCoverageDataType}
					temporalCoverageStartDate={editingDataset.temporalCoverageStartDate}
					temporalCoverageEndDate={editingDataset.temporalCoverageEndDate}
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
						{D1.datasetsSpacialTemporal}
						<input
							type="date"
							className="form-control"
							value={editingDataset.spacialTemporal}
							onChange={(e) => {
								setEditingDataset({
									...editingDataset,
									spacialTemporal: e.target.value,
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
									spacialResolutions: values.map(({ value }) => value),
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
		</>
	);
};

export const GlobalInformation = withCodesLists(['CL_FREQ'])(
	GlobalInformationTab
);

export const InternalManagement = withCodesLists([
	'CL_ACCESS_RIGHTS',
	'CL_CONF_STATUS',
	'CL_PROCESS_STEP',
])(InternalManagementTab);

export const StaticsInformations = withCodesLists([
	'CL_DATA_TYPES',
	'CL_STAT_UNIT',
	'CL_FREQ',
	'CL_GEO',
	'CL_TYPE_GEO',
])(StaticsInformationsTab);
