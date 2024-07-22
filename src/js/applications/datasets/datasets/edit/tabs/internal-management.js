import { D1 } from '../../../../../i18n';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { withCodesLists } from '../../../../../hooks/hooks';
import api from '../../../api/datasets-api';
import operationSeries from '../../../../../remote-api/operations-api';
import { LabelRequired } from '@inseefr/wilco';
import { ClientSideError, SelectRmes } from '../../../../../utils';
import { convertCodesListsToSelectOption } from '../../../../../utils/datasets/codelist-to-select-options';
import { DisseminationStatusInput } from '../../../../../utils/dissemination-status/disseminationStatus';
import { ContributorsInput } from '../../../../../utils/contributors/contributors';
import { useStampsOptions } from '../../../../../new-architecture/utils/hooks/stamps';
import { TextInput, Row } from '../../../../../new-architecture/components';

const InternalManagementTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const stampsOptions = useStampsOptions();

	const { data: seriesOptions = [] } = useQuery({
		queryKey: ['series'],
		queryFn: () => {
			return operationSeries.getSeriesList().then((stamps) =>
				stamps.map((serie) => ({
					value: serie.id,
					label: serie.label,
				}))
			);
		},
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
					<TextInput
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
					<SelectRmes
						unclearable
						value={editingDataset.catalogRecord?.creator}
						options={stampsOptions}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								catalogRecord: {
									...(editingDataset.catalogRecord ?? {}),
									creator: option,
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
					<ContributorsInput
						stampListOptions={stampsOptions}
						value={editingDataset.catalogRecord?.contributor}
						handleChange={(values) => {
							setEditingDataset({
								...editingDataset,
								catalogRecord: {
									...(editingDataset.catalogRecord ?? {}),
									contributor: values,
								},
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
						required
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.contributor}
					></ClientSideError>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<DisseminationStatusInput
						value={editingDataset.disseminationStatus}
						handleChange={(value) => {
							setEditingDataset({
								...editingDataset,
								disseminationStatus: value,
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
						required
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.disseminationStatus}
					></ClientSideError>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<LabelRequired>{D1.generatedBy}</LabelRequired>
					<SelectRmes
						unclearable
						value={editingDataset.idSerie}
						options={seriesOptions}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								idSerie: option,
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
					</label>
					<SelectRmes
						value={editingDataset.accessRights}
						options={clAccessRightsOptions}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								accessRights: option,
							});
						}}
					/>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsConfidentialityStatus}
					</label>
					<SelectRmes
						value={editingDataset.confidentialityStatus}
						options={clConfStatusOptions}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								confidentialityStatus: option,
							});
						}}
					/>
				</div>
			</Row>

			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetProcessStep}
					</label>
					<SelectRmes
						unclearable
						value={editingDataset.processStep}
						options={clProcessStep}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								processStep: option,
							});
						}}
					/>
				</div>
			</Row>
			<Row>
				<div className="col-md-12 form-group">
					<label className="w-100 wilco-label-required">
						{D1.datasetsArchiveUnit}
					</label>
					<SelectRmes
						unclearable
						value={editingDataset.archiveUnit}
						options={archivageUnits}
						onChange={(option) => {
							setEditingDataset({
								...editingDataset,
								archiveUnit: option,
							});
						}}
					/>
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
