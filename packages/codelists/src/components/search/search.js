import React, { useState, useEffect } from 'react';
import { Select, Loading } from '@inseefr/wilco';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
	Stores,
} from 'bauhaus-utilities';
import { API } from '../../apis';
import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';

const filterId = ArrayUtils.filterKeyDeburr(['id']);
const filterLabel = ArrayUtils.filterKeyDeburr(['labelLg1']);
const filterCode = ArrayUtils.filterKeyDeburr(['codes/labelLg1']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterValidationState = ArrayUtils.filterKeyDeburr(['validationState']);

const fields = ['id', 'labelLg1', 'code', 'creator', 'validationState'];
const validateStateOptions = [
	{ value: 'Unpublished', label: D.statusUnpublishedM },
	{ value: 'Modified', label: D.statusModifiedM },
	{ value: 'Validated', label: D.statusValidatedM },
];

class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		id: '',
		labelLg1: '',
		code: [''],
		creator: '',
		validationState: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, (newState) => {
		const { id, labelLg1, code, creator, validationState } = newState;
		return this.props.data
			.filter(filterId(id))
			.filter(filterLabel(labelLg1))
			.filter(filterCode(code))
			.filter(filterCreator(creator))
			.filter(filterValidationState(validationState));
	});

	render() {
		const { data, id, labelLg1, code, creator, validationState } = this.state;
		const { stampListOptions } = this.props;
		const dataLinks = data.map((component) => (
			<li key={component.id} className="list-group-item text-left">
				<Link to={`/codelists/components/${component.id}`}>
					{formatLabel(component)}
				</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.codelistsSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/codelists'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.idTitle}
							<input
								value={id}
								onChange={(e) => this.handlers.id(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<input
								value={labelLg1}
								onChange={(e) => this.handlers.labelLg1(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.codeTitle}
							<input
								value={code}
								onChange={(e) => this.handlers.code(e.target.value)}
								type="text"
								className="form-control"
							/>
						</label>
					</div>
				</div>
				<div className="row form-group">
					<div className="col-md-6">
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
									this.handlers.creator(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label className="w-100">
							{D.componentValididationStatusTitle}
							<Select
								placeholder=""
								value={
									validateStateOptions.find(
										(option) => option.value === validationState
									) || ''
								}
								options={validateStateOptions}
								onChange={(value) => {
									this.handlers.validationState(value);
								}}
							/>
						</label>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}

const SearchListContainer = () => {
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
