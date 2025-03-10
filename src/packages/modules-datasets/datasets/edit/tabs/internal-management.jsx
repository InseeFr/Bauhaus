import { useEffect, useState } from 'react';

import { ContributorsInput } from '@components/contributors/contributors';
import { DisseminationStatusInput } from '@components/dissemination-status/disseminationStatus';
import { ClientSideError } from '@components/errors-bloc';
import { TextInput } from '@components/form/input';
import LabelRequired from '@components/label-required';
import { Row } from '@components/layout';
import { Select } from '@components/select-rmes';

import { DatasetsApi } from '@sdk/index';

import { withCodesLists } from '@utils/hoc/withCodesLists';
import { useStampsOptions } from '@utils/hooks/stamps';

import { D1 } from '../../../../deprecated-locales';
import {
	CL_ACCESS_RIGHTS,
	CL_CONF_STATUS,
	CL_PROCESS_STEP,
} from '../../../../redux/actions/constants/codeList';
import { convertCodesListsToSelectOption } from '../../../utils/codelist-to-select-options';
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
		props[CL_ACCESS_RIGHTS],
	);

	const clConfStatusOptions = convertCodesListsToSelectOption(
		props[CL_CONF_STATUS],
	);

	const clProcessStep = convertCodesListsToSelectOption(props[CL_PROCESS_STEP]);

	const [archivageUnits, setArchivageUnits] = useState([]);
	useEffect(() => {
		DatasetsApi.getArchivageUnits().then(setArchivageUnits);
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
					<Select
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
					<Select
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
					<Select
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
					<Select
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
					<Select
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
					<Select
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
	CL_ACCESS_RIGHTS,
	CL_CONF_STATUS,
	CL_PROCESS_STEP,
])(InternalManagementTab);
