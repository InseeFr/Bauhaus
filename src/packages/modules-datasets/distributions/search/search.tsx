import { validateStateOptions } from '@model/ValidationState';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { AdvancedSearchList } from '@components/advanced-search/home';
import { CreatorsInput } from '@components/creators-input';
import { DatePicker } from '@components/date-picker';
import { DisseminationStatusInput } from '@components/dissemination-status/disseminationStatus';
import { TextInput } from '@components/form/input';
import { Column } from '@components/layout';
import { Loading } from '@components/loading';
import { Select } from '@components/select-rmes';

import { DistributionApi } from '@sdk/distributions-api';

import { filterKeyDeburr } from '@utils/array-utils';
import { useTitle } from '@utils/hooks/useTitle';
import useUrlQueryParameters from '@utils/hooks/useUrlQueryParameters';

import D from '../../../deprecated-locales/build-dictionary';
import { useSeriesOperationsOptions } from '../../datasets/edit/tabs/useSeriesOperationsOptions';

const filterLabel = filterKeyDeburr(['labelLg1']);

const defaultFormState = {
	labelLg1: '',
	validationStatus: '',
	created: '',
	updated: '',
	datasetLabelLg1: '',
	altIdentifier: '',
	creator: '',
	disseminationStatus: '',
	datasetValidationStatus: '',
	wasGeneratedIRIs: '',
	datasetCreated: '',
	datasetUpdated: '',
};

export const Component = () => {
	useTitle(D.distributionsTitle, D.advancedSearch);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		DistributionApi.getDistributionsForSearch()
			.then(setData)
			.finally(() => setLoading(false));
	}, []);

	const seriesOperationsOptions = useSeriesOperationsOptions();

	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

	const {
		labelLg1,
		validationStatus,
		created,
		updated,
		datasetLabelLg1,
		altIdentifier,
		creator,
		disseminationStatus,
		datasetValidationStatus,
		wasGeneratedIRIs,
		datasetCreated,
		datasetUpdated,
	} = form;

	const filteredData = data.filter(filterLabel(labelLg1));

	const dataLinks = filteredData.map(({ id, labelLg1 }) => (
		<li key={id} className="list-group-item">
			<Link to={`/datasets/distributions/${id}`}>{labelLg1}</Link>
		</li>
	));

	if (loading) return <Loading />;

	return (
		<AdvancedSearchList
			title={D.distributionsSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Navigate to="/datasets/distributions" />}
		>
			<fieldset>
				<legend>{D.distributionTitle}</legend>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<TextInput
								value={labelLg1}
								onChange={(e) => handleChange('labelLg1', e.target.value)}
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-3">
						<label className="w-100">{D.createdDateTitle}</label>
						<DatePicker
							value={created}
							onChange={(value: any) => handleChange('created', value)}
						/>
					</div>
					<div className="col-md-4">
						<label className="w-100">{D.modifiedDateTitle}</label>
						<DatePicker
							value={updated}
							onChange={(value: any) => handleChange('updated', value)}
						/>
					</div>
					<div className="col-md-4">
						<label className="w-100">{D.validationStatusTitle}</label>
						<Select
							value={validationStatus}
							options={validateStateOptions}
							onChange={(value: any) => handleChange('validationStatus', value)}
						/>
					</div>
				</div>
			</fieldset>
			<fieldset>
				<legend>{D.datasetTitle}</legend>
				<div className="row form-group">
					<Column>
						<label className="w-100">{D.labelTitle}</label>
						<TextInput
							value={datasetLabelLg1}
							onChange={(e: any) =>
								handleChange('datasetLabelLg1', e.target.value)
							}
						/>
					</Column>
					<Column>
						<label className="w-100">{D.datasetsAltId}</label>
						<TextInput
							value={altIdentifier}
							onChange={(e: any) =>
								handleChange('altIdentifier', e.target.value)
							}
						/>
					</Column>
				</div>
				<div className="row form-group">
					<div className="col-md-4">
						<CreatorsInput
							lang="default"
							value={creator}
							onChange={(value: any) => handleChange('creator', value)}
							required={false}
						/>
					</div>
					<div className="col-md-4">
						<DisseminationStatusInput
							value={disseminationStatus}
							handleChange={(value: any) =>
								handleChange('disseminationStatus', value)
							}
						/>
					</div>
					<div className="col-md-4">
						<label className="w-100">{D.validationStatusTitle}</label>
						<Select
							value={datasetValidationStatus}
							options={validateStateOptions}
							onChange={(value: any) =>
								handleChange('datasetValidationStatus', value)
							}
						/>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-3">
						<label className="w-100">{D.createdDateTitle}</label>
						<DatePicker
							value={datasetCreated}
							onChange={(value: any) => handleChange('datasetCreated', value)}
						/>
					</div>
					<div className="col-md-3">
						<label className="w-100">{D.modifiedDateTitle}</label>
						<DatePicker
							value={datasetUpdated}
							onChange={(value: any) => handleChange('datasetUpdated', value)}
						/>
					</div>
					<Column>
						<label className="w-100">{D.generatedBy}</label>
						<Select
							value={wasGeneratedIRIs}
							options={seriesOperationsOptions}
							onChange={(value: any) => handleChange('wasGeneratedIRIs', value)}
							optionRenderer={(v: any) => {
								if (!v.value.includes('/serie/')) {
									return <span className="padding">{v.label}</span>;
								}
								return `${v.label}`;
							}}
						/>
					</Column>
				</div>
			</fieldset>
		</AdvancedSearchList>
	);
};
