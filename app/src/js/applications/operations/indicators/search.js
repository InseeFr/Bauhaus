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
} from 'bauhaus-utilities';
import * as select from 'js/reducers';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const filterCreator = ArrayUtils.filterKeyDeburr(['creator']);
const filterGestionnaire = ArrayUtils.filterKeyDeburr(['publishers']);

const fields = ['prefLabelLg1', 'creator', 'gestionnaire'];
const sortByLabel = ArrayUtils.sortArray('prefLabelLg1');

class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		prefLabelLg1: '',
		creator: '',
		gestionnaire: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, (newState) => {
		const { prefLabelLg1, creator, gestionnaire } = newState;
		return this.props.data
			.filter(filterCreator(creator))
			.filter(filterLabel(prefLabelLg1))
			.filter(filterGestionnaire(gestionnaire));
	});

	render() {
		const { data, prefLabelLg1, creator, gestionnaire } = this.state;
		const { organisations, stamps } = this.props;

		const creatorsOptions = ItemToSelectModel.toSelectModel(organisations);
		const stampsOptions = stamps.map((stamp) => ({
			value: stamp,
			label: stamp,
		}));
		const dataLinks = data.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/indicator/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.indicatorsSearchTitle}
				data={dataLinks}
				initializeState={this.initializeState}
				redirect={<Redirect to={'/operations/indicators'} push />}
			>
				<div className="row form-group">
					<div className="col-md-12">
						<label className="w-100">
							{D.searchLabelPlaceholder}
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
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="w-100">
							{D.organisation}

							<Select
								placeholder=""
								value={
									creatorsOptions.find((option) => option.value === creator) ||
									''
								}
								options={creatorsOptions}
								onChange={(value) => {
									this.handlers.creator(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label htmlFor="typeOperation" className="w-100">
							{D.creatorTitle}

							<Select
								placeholder=""
								value={
									stampsOptions.find(
										(option) => option.value === gestionnaire
									) || ''
								}
								options={stampsOptions}
								onChange={(value) => {
									this.handlers.gestionnaire(value);
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
	componentDidMount() {
		api.getIndicatorsSearchList().then((data) => {
			this.setState({ data: sortByLabel(data) });
		});
	}

	render() {
		const { data } = this.state;
		const { organisations, stamps } = this.props;

		if (!data) return <Loading />;
		return (
			<SearchFormList
				data={data}
				organisations={organisations}
				stamps={stamps}
			/>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		organisations: state.operationsOrganisations.results,
		stamps: select.getStampList(state) || [],
	};
};

export default connect(mapStateToProps)(SearchListContainer);
