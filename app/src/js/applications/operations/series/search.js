import D from 'js/i18n';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading } from '@inseefr/wilco';
import api from 'js/remote-api/operations-api';
import { connect } from 'react-redux';
import SelectRmes from 'js/applications/shared/select-rmes';
import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
	ItemToSelectModel,
} from 'bauhaus-utilities';
import { CL_SOURCE_CATEGORY } from 'js/actions/constants/codeList';
import * as select from 'js/reducers';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const filterTypeCode = ArrayUtils.filterKeyDeburr(['typeCode']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterGestionnaire = ArrayUtils.filterKeyDeburr(['gestionnaires']);
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

	handlers = this.handleChange(fields, newState => {
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
			.filter(filterCreator(creator))
			.filter(filterGestionnaire(gestionnaire))
			.filter(series => {
				return (
					!dataCollector ||
					(series.dataCollector || [])
						.map(collector => collector.id)
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
		const stampsOptions = stamps.map(stamp => ({ value: stamp, label: stamp }));

		const dataLinks = data.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.seriesSearchTitle}
				data={dataLinks}
				backUrl="/operations/series"
				initializeState={this.initializeState}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.labelTitle}
							<input
								value={prefLabelLg1}
								onChange={e => this.handlers.prefLabelLg1(e.target.value)}
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

							<SelectRmes
								placeholder=""
								unclearable
								value={typeCode}
								options={categories.codes.map(cat => {
									return { value: cat.code, label: cat.labelLg1 };
								})}
								onChange={value => {
									this.handlers.typeCode(value);
								}}
							/>
						</label>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-12">
						<label htmlFor="typeOperation" className="w-100">
							{D.contributorTitle}

							<SelectRmes
								placeholder=""
								unclearable
								value={gestionnaire}
								options={stampsOptions}
								onChange={value => {
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

							<SelectRmes
								placeholder=""
								unclearable
								value={creator}
								options={organisationsOptions}
								onChange={value => {
									this.handlers.creator(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="w-100">
							{D.dataCollector}

							<SelectRmes
								placeholder=""
								unclearable
								value={dataCollector}
								options={organisationsOptions}
								onChange={value => {
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
		api.getSeriesSearchList().then(data => {
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

const mapStateToProps = state => {
	const categories =
		state.operationsCodesList.results[CL_SOURCE_CATEGORY] || {};
	return {
		categories,
		organisations: state.operationsOrganisations.results,
		stamps: select.getStampList(state) || [],
	};
};

export default connect(mapStateToProps)(SearchListContainer);
