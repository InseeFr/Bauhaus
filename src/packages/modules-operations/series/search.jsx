import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
	AdvancedSearchList,
	Column,
	Loading,
	TextInput,
} from '../../components';
import { Select } from '../../components/select-rmes';

import D from '../../deprecated-locales';

import { OperationsApi } from '../../sdk/operations-api';
import { filterKeyDeburr } from '../../utils/array-utils';
import { useOrganizationsOptions } from '../../utils/hooks/organizations';
import { useStamps } from '../../utils/hooks/stamps';
import { useTitle } from '../../utils/hooks/useTitle';
import useUrlQueryParameters from '../../utils/hooks/useUrlQueryParameters';
import { TypeCodeInput } from './search/typeCodeInput';

const filterLabel = filterKeyDeburr(['prefLabelLg1']);
const filterTypeCode = filterKeyDeburr(['typeCode']);

const defaultFormState = {
	prefLabelLg1: '',
	typeCode: '',
	creator: '',
	publisher: '',
	dataCollector: '',
};

export const SearchFormList = ({ stamps, data }) => {
	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

	const { prefLabelLg1, typeCode, creator, publisher, dataCollector } = form;

	const organisationsOptions = useOrganizationsOptions();
	const stampsOptions = stamps.map((stamp) => ({
		value: stamp,
		label: stamp,
	}));

	const filteredData = data
		.filter(filterLabel(prefLabelLg1))
		.filter(filterTypeCode(typeCode))
		.filter((series) => {
			const creators = series.creators || [];
			const formattedCreators = Array.isArray(creators) ? creators : [creators];

			return !creator || formattedCreators.includes(creator);
		})
		.filter((series) => {
			const publishers = series.publishers || [];
			const formattedPublishers = Array.isArray(publishers)
				? publishers
				: [publishers];

			return (
				!publisher ||
				formattedPublishers.map(({ id }) => id).includes(publisher)
			);
		})
		.filter((series) => {
			const dataCollectors = series.dataCollectors || [];
			const formattedDataCollectors = Array.isArray(dataCollectors)
				? dataCollectors
				: [dataCollectors];
			return (
				!dataCollector ||
				formattedDataCollectors.map(({ id }) => id).includes(dataCollector)
			);
		});

	const dataLinks = filteredData.map(({ id, prefLabelLg1 }) => (
		<li key={id} className="list-group-item">
			<Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
		</li>
	));
	return (
		<AdvancedSearchList
			title={D.seriesSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Navigate to="/operations/series" />}
		>
			<div className="row form-group">
				<div className="col-md-12">
					<label className="w-100">
						{D.labelTitle}
						<TextInput
							value={prefLabelLg1}
							onChange={(e) => handleChange('prefLabelLg1', e.target.value)}
						/>
					</label>
				</div>
			</div>
			<div className="form-group row">
				<div className="col-md-12">
					<TypeCodeInput
						value={typeCode}
						onChange={(value) => handleChange('typeCode', value)}
					/>
				</div>
			</div>
			<div className="form-group row">
				<div className="col-md-12">
					<label htmlFor="creator" className="w-100">
						{D.creatorTitle}

						<Select
							placeholder=""
							value={stampsOptions.find((code) => code.value === creator) || ''}
							options={stampsOptions}
							onChange={(value) => {
								handleChange('creator', value);
							}}
						/>
					</label>
				</div>
			</div>
			<div className="form-group row">
				<Column>
					<label htmlFor="publisher" className="w-100">
						{D.organisation}

						<Select
							placeholder=""
							value={
								organisationsOptions.find((code) => code.value === publisher) ||
								''
							}
							options={organisationsOptions}
							onChange={(value) => {
								handleChange('publisher', value);
							}}
						/>
					</label>
				</Column>
				<Column>
					<label htmlFor="dataCollector" className="w-100">
						{D.dataCollector}

						<Select
							placeholder=""
							value={
								organisationsOptions.find(
									(code) => code.value === dataCollector,
								) || ''
							}
							options={organisationsOptions}
							onChange={(value) => {
								handleChange('dataCollector', value);
							}}
						/>
					</label>
				</Column>
			</div>
		</AdvancedSearchList>
	);
};

export const Component = () => {
	useTitle(D.seriesTitle + ' - ' + D.operationsTitle, D.advancedSearch);
	const [data, setData] = useState();

	const { data: stamps = [] } = useStamps();

	useEffect(() => {
		OperationsApi.getSeriesSearchList().then(setData);
	}, []);

	if (!data) return <Loading />;
	return <SearchFormList data={data} stamps={stamps} />;
};
