import D from 'js/i18n';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Loading } from 'bauhaus-library';
import { AbstractSearchComponent } from 'js/components/shared/advanced-search/home-container';
import api from 'js/remote-api/operations-api';
import { connect } from 'react-redux';
import SelectRmes from 'js/components/shared/select-rmes';

import { filterKeyDeburr } from 'js/utils/array-utils';
import SearchList from 'js/components/shared/advanced-search/home';
import { CL_SOURCE_CATEGORY } from 'js/actions/constants/codeList';
import { toSelectModel } from '../shared/utils/itemToSelectModel';
const filterLabel = filterKeyDeburr(['prefLabelLg1']);
const filterTypeCode = filterKeyDeburr(['typeCode']);
const filterCreator = filterKeyDeburr(['creator']);
const filterGestionnaire = filterKeyDeburr(['gestionnaire']);
const fields = [
	'prefLabelLg1',
	'typeCode',
	'creator',
	'dataCollector',
	'gestionnaire',
];

class SearchFormList extends AbstractSearchComponent {
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
		const { categories, organisations } = this.props;
		const organisationsOptions = toSelectModel(organisations);

		const dataLinks = data.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/series/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<SearchList
				title={D.seriesSearchTitle}
				data={dataLinks}
				backUrl="/operations/series"
				initializeState={this.initializeState}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="full-label">
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
						<label htmlFor="typeOperation" className="full-label">
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
						<label htmlFor="typeOperation" className="full-label">
							{D.contributorTitle}

							<SelectRmes
								placeholder=""
								unclearable
								value={gestionnaire}
								options={organisationsOptions}
								onChange={value => {
									this.handlers.gestionnaire(value);
								}}
							/>
						</label>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="full-label">
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
						<label htmlFor="typeOperation" className="full-label">
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
			</SearchList>
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
			this.setState({ data });
		});
	}

	render() {
		const { data } = this.state;
		const { categories, organisations } = this.props;
		if (!data) return <Loading />;
		return (
			<SearchFormList
				data={data}
				categories={categories}
				organisations={organisations}
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
	};
};

export default connect(mapStateToProps)(SearchListContainer);
