import D from 'js/i18n';
import { Link, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Select } from '@inseefr/wilco';
import { Loading } from 'js/new-architecture/components/loading/loading';

import api from 'js/remote-api/operations-api';
import { useSelector } from 'react-redux';
import {
	ArrayUtils,
	AdvancedSearchList,
	ItemToSelectModel,
	Stores,
	useTitle,
	useUrlQueryParameters,
} from 'js/utils';
import { CL_SOURCE_CATEGORY } from 'js/actions/constants/codeList';
import { useCodesList } from '../../../hooks/hooks';
import { Column } from '../../../new-architecture/components/layout';
import { TextInput } from '../../../new-architecture/components/form/input';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const filterTypeCode = ArrayUtils.filterKeyDeburr(['typeCode']);

const defaultFormState = {
	prefLabelLg1: '',
	typeCode: '',
	creator: '',
	publisher: '',
	dataCollector: '',
};

export const SearchFormList = ({ categories, organisations, stamps, data }) => {
	const [form, _setForm, reset, handleChange] =
		useUrlQueryParameters(defaultFormState);

	const { prefLabelLg1, typeCode, creator, publisher, dataCollector } = form;

	const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);
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
			redirect={<Redirect to={'/operations/series'} push />}
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
					<label htmlFor="typeOperation" className="w-100">
						{D.operationType}

						<Select
							placeholder=""
							value={
								(
									categories.codes.find(
										(category) => category.code === typeCode
									) || {}
								).value
							}
							options={categories?.codes?.map((cat) => {
								return { value: cat.code, label: cat.labelLg1 };
							})}
							onChange={(value) => {
								handleChange('typeCode', value);
							}}
						/>
					</label>
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
									(code) => code.value === dataCollector
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

const SearchListContainer = () => {
	useTitle(D.seriesTitle + ' - ' + D.operationsTitle, D.advancedSearch);
	const [data, setData] = useState();
	const categories = useCodesList(CL_SOURCE_CATEGORY);
	const organisations = useSelector(
		(state) => state.operationsOrganisations.results
	);
	const stamps = useSelector(
		(state) => Stores.Stamps.getStampList(state) || []
	);

	useEffect(() => {
		api.getSeriesSearchList().then(setData);
	}, []);

	if (!data) return <Loading />;
	return (
		<SearchFormList
			data={data}
			categories={categories}
			organisations={organisations}
			stamps={stamps}
		/>
	);
};

export default SearchListContainer;
