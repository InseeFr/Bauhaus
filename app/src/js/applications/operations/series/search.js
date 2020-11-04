import D from 'js/i18n';
import { Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading, Select } from '@inseefr/wilco';
import api from 'js/remote-api/operations-api';
import { connect } from 'react-redux';
import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
	ItemToSelectModel,
	Stores,
} from 'bauhaus-utilities';
import { CL_SOURCE_CATEGORY } from 'js/actions/constants/codeList';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const filterTypeCode = ArrayUtils.filterKeyDeburr(['typeCode']);
const filterGestionnaire = ArrayUtils.filterKeyDeburr(['publishers']);
const fields = [
	'prefLabelLg1',
	'typeCode',
	'creator',
	'dataCollector',
	'gestionnaire',
];
const sortByLabel = ArrayUtils.sortArray('prefLabelLg1');

class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		prefLabelLg1: '',
		typeCode: '',
		creator: '',
		dataCollector: '',
		gestionnaire: '',
		organisations: [],
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, (newState) => {
		const {
			prefLabelLg1,
			typeCode,
			creator,
			dataCollector,
			gestionnaire,
		} = newState;
		return this.props.data
			.filter(filterLabel(prefLabelLg1))
			.filter(filterTypeCode(typeCode))
			.filter((series) => {
				const creators = series.creators || [];
				// For retrocompatibility
				const formattedCreators = Array.isArray(creators)
					? creators
					: [creators];
				return (
					!creator ||
					formattedCreators.map((creator) => creator.id).includes(creator)
				);
			})
			.filter(filterGestionnaire(gestionnaire))
			.filter((series) => {
				return (
					!dataCollector ||
					(series.dataCollectors || [])
						.map((collector) => collector.id)
						.includes(dataCollector)
				);
			});
	});

	render() {
		const {
			data,
			prefLabelLg1,
			typeCode,
			creator,
			dataCollector,
			gestionnaire,
		} = this.state;
		const { categories, organisations, stamps } = this.props;
		const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);
		const stampsOptions = stamps.map((stamp) => ({
			value: stamp,
			label: stamp,
		}));

		const dataLinks = data.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.seriesSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/operations/series'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<input
								value={prefLabelLg1}
								onChange={(e) => this.handlers.prefLabelLg1(e.target.value)}
								type="text"
								className="form-control"
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
									categories.codes.find((code) => code.value === typeCode) || ''
								}
								options={categories.codes.map((cat) => {
									return { value: cat.code, label: cat.labelLg1 };
								})}
								onChange={(value) => {
									this.handlers.typeCode(value);
								}}
							/>
						</label>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-12">
						<label htmlFor="typeOperation" className="w-100">
							{D.creatorTitle}

							<Select
								placeholder=""
								value={
									stampsOptions.find((code) => code.value === gestionnaire) ||
									''
								}
								options={stampsOptions}
								onChange={(value) => {
									this.handlers.gestionnaire(value);
								}}
							/>
						</label>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="w-100">
							{D.organisation}

							<Select
								placeholder=""
								value={
									organisationsOptions.find((code) => code.value === creator) ||
									''
								}
								options={organisationsOptions}
								onChange={(value) => {
									this.handlers.creator(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="w-100">
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
									this.handlers.dataCollector(value);
								}}
							/>
						</label>
					</div>
				</div>
			</AdvancedSearchList>
		);
	}
}
class SearchListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillMount() {
		api.getSeriesSearchList().then((data) => {
			this.setState({ data: sortByLabel(data) });
		});
	}

	render() {
		const { data } = this.state;
		const { categories, organisations, stamps } = this.props;
		if (!data) return <Loading />;
		return (
			<SearchFormList
				data={data}
				categories={categories}
				organisations={organisations}
				stamps={stamps}
			/>
		);
	}
}

const mapStateToProps = (state) => {
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	return {
		categories,
		organisations: state.operationsOrganisations.results,
		stamps: Stores.Stamps.getStampList(state) || [],
	};
};

export default connect(mapStateToProps)(SearchListContainer);
