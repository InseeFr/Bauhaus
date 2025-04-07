import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { AdvancedSearchList } from '@components/advanced-search/home';
import { TextInput } from '@components/form/input';
import { Column } from '@components/layout';
import { Loading } from '@components/loading';
import { Select } from '@components/select-rmes';

import { filterKeyDeburr } from '@utils/array-utils';
import { useStampsOptions } from '@utils/hooks/stamps';
import { useTitle } from '@utils/hooks/useTitle';
import useUrlQueryParameters from '@utils/hooks/useUrlQueryParameters';

import { validateStateOptions } from '../../../model/ValidationState';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';

const filterId = filterKeyDeburr(['id']);
const filterLabel = filterKeyDeburr(['labelLg1']);
const filterCreator = filterKeyDeburr(['creator']);
const filterValidationState = filterKeyDeburr(['validationState']);
const filterCode = filterKeyDeburr(['codes.code']);
const filterCodeLabel = filterKeyDeburr(['codes.labelLg1']);

const defaultFormState = {
	id: '',
	labelLg1: '',
	code: '',
	codeLabel: '',
	creator: '',
	validationState: '',
};

const SearchFormList = ({ stampListOptions, data }) => {
	let form, reset, handleChange;
	({ form, reset, handleChange } = useUrlQueryParameters(defaultFormState));

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
			redirect={<Navigate to="/codelists" push />}
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
								onChange={(value) => {
									handleChange('creator', value);
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
										(option) => option.value === validationState,
									) || ''
								}
								options={validateStateOptions}
								onChange={(value) => {
									handleChange('validationState', value);
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

export const Component = () => {
	useTitle(D.codelistsTitle, D.advancedSearch);

	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const stampListOptions = useStampsOptions();

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
