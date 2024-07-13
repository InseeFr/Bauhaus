import { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import {
	ArrayUtils,
	AdvancedSearchList,
	Stores,
	useTitle,
	useUrlQueryParameters,
} from '../../../../utils';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';
import { Column } from '../../../../new-architecture/components/layout';
import { TextInput, Loading } from '../../../../new-architecture/components';
import { validateStateOptions } from '../../../../new-architecture/model/ValidationState';

const filterId = ArrayUtils.filterKeyDeburr(['id']);
const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);
const filterCode = ArrayUtils.filterKeyDeburr(['codes.code']);
const filterCodeLabel = ArrayUtils.filterKeyDeburr(['codes.labelLg1']);

const defaultFormState = {
	id: '',
	labelLg1: '',
	code: '',
	codeLabel: '',
	creator: '',
	validationState: '',
};

const SearchFormList = ({ stampListOptions, data }) => {
	const { form, reset, handleChange } = useUrlQueryParameters(defaultFormState);

	const { id, labelLg1, creator, validationState, code, codeLabel } = form;

	const filteredData = data
		.filter(filterId(id))
		.filter(filterLabel(labelLg1))
		.filter(filterCode(code))
		.filter(filterCodeLabel(codeLabel))
		.filter(filterCreator(creator))
		.filter(filterValidationState(validationState));

	const dataLinks = filteredData.map((codelist) => (
		<li key={codelist.id} className="list-group-item text-left">
			<Link to={`/codelists/${codelist.id}`}>{formatLabel(codelist)}</Link>
		</li>
	));
	return (
		<AdvancedSearchList
			title={D.codelistsSearchTitle}
			data={dataLinks}
			initializeState={reset}
			redirect={<Redirect to={'/codelists'} push />}
		>
			<fieldset>
				<legend>{D.codelistTitle}</legend>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.idTitle}
							<TextInput
								value={id}
								onChange={(e) => handleChange('id', e.target.value)}
							/>
						</label>
					</div>
				</div>
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
					<Column>
						<label className="w-100">
							{D.creator}
							<Select
								placeholder=""
								value={
									stampListOptions.find((option) => option.value === creator) ||
									''
								}
								options={stampListOptions}
								onChange={(option) => {
									handleChange('creator', option?.value ?? '');
								}}
							/>
						</label>
					</Column>
					<Column>
						<label className="w-100">
							{D.codelistValidationStatusTitle}
							<Select
								placeholder=""
								value={
									validateStateOptions.find(
										(option) => option.value === validationState
									) || ''
								}
								options={validateStateOptions}
								onChange={(option) => {
									handleChange('validationState', option?.value ?? '');
								}}
							/>
						</label>
					</Column>
				</div>
			</fieldset>
			<fieldset>
				<legend>{D.codeTitle}</legend>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.idTitle}
							<TextInput
								value={code}
								onChange={(e) => handleChange('code', e.target.value)}
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<TextInput
								value={codeLabel}
								onChange={(e) => handleChange('codeLabel', e.target.value)}
							/>
						</label>
					</div>
				</div>
			</fieldset>
		</AdvancedSearchList>
	);
};

const SearchListContainer = () => {
	useTitle(D.codelistsTitle, D.advancedSearch);

	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const stampListOptions = useSelector((state) =>
		Stores.Stamps.getStampListOptions(state)
	);

	useEffect(() => {
		API.getCodelistsForSearch()
			.then((codelists) => {
				setItems(codelists);
			})
			.finally(() => setLoading(false));
	}, []);
	if (loading) {
		return <Loading />;
	}
	return <SearchFormList data={items} stampListOptions={stampListOptions} />;
};

export default SearchListContainer;
