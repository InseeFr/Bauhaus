import { D1 } from 'js/i18n';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withCodesLists } from 'js/hooks/hooks';
import api from '../../../api/datasets-api';
import operationSeries from 'js/remote-api/operations-api';
import ReactSelect from 'react-select';
import { LabelRequired } from '@inseefr/wilco';
import { ClientSideError, Row, StampsApi, Stores } from 'bauhaus-utilities';
import { convertCodesListsToSelectOption } from 'js/utils/datasets/codelist-to-select-options';

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

export const InternalManagement = withCodesLists([
	'CL_ACCESS_RIGHTS',
	'CL_CONF_STATUS',
	'CL_PROCESS_STEP',
])(InternalManagementTab);
