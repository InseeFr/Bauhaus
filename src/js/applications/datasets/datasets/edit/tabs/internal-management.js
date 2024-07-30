import { D1 } from '../../../../../i18n';
import { useEffect, useState } from 'react';
import { withCodesLists } from '../../../../../hooks/hooks';
import api from '../../../api/datasets-api';
import { LabelRequired } from '@inseefr/wilco';
import { ClientSideError, SelectRmes } from '../../../../../utils';
import { convertCodesListsToSelectOption } from '../../../../../utils/datasets/codelist-to-select-options';
import { DisseminationStatusInput } from '../../../../../utils/dissemination-status/disseminationStatus';
import { ContributorsInput } from '../../../../../utils/contributors/contributors';
import { useStampsOptions } from '../../../../../new-architecture/utils/hooks/stamps';
import { TextInput, Row } from '../../../../../new-architecture/components';
import { useSeriesOperationsOptions } from './useSeriesOperationsOptions';

const InternalManagementTab = ({
	editingDataset,
	setEditingDataset,
	clientSideErrors,
	setClientSideErrors,
	...props
}) => {
	const stampsOptions = useStampsOptions();

	const seriesOperationsOptions = useSeriesOperationsOptions();

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
						multi={true}
						value={editingDataset.wasGeneratedIRIs}
						options={seriesOperationsOptions}
						optionRenderer={(v) => {
							if (!v.value.includes('/serie/')) {
								return <span className="padding">{v.label}</span>;
							}
							return `${v.label}`;
						}}
						onChange={(values) => {
							setEditingDataset({
								...editingDataset,
								wasGeneratedIRIs: values.map(({ value }) => value),
							});
							setClientSideErrors((clientSideErrors) => ({
								...clientSideErrors,
								errorMessage: [],
							}));
						}}
					/>
					<ClientSideError
						error={clientSideErrors?.fields?.wasGeneratedIRIs}
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
