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

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);

const fields = ['prefLabelLg1', 'creator', 'publisher'];
const sortByLabel = ArrayUtils.sortArray('prefLabelLg1');

export class SearchFormList extends AbstractAdvancedSearchComponent {
	static defaultState = {
		prefLabelLg1: '',
		creator: '',
		publisher: '',
	};

	constructor(props) {
		super(props, SearchFormList.defaultState);
	}

	handlers = this.handleChange(fields, (newState) => {
		const { prefLabelLg1, creator, publisher } = newState;
		return this.props.data

			.filter(filterLabel(prefLabelLg1))
			.filter((series) => {
				const creators = series.creators || [];
				const formattedCreators = Array.isArray(creators)
					? creators
					: [creators];
				return !creator || formattedCreators.includes(creator);
			})
			.filter((series) => {
				const publishers = series.publishers || [];
				const formattedPublishers = Array.isArray(publishers)
					? publishers
					: [publishers];
				return !publisher || formattedPublishers.includes(publisher);
			});
	});

	render() {
		const { data, prefLabelLg1, creator, publisher } = this.state;
		const { organisations, stamps } = this.props;

		const organisationsOptions = ItemToSelectModel.toSelectModel(organisations);
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
						<label htmlFor="publisher" className="w-100">
							{D.organisation}

							<Select
								placeholder=""
								value={
									organisationsOptions.find(
										(option) => option.value === publisher
									) || ''
								}
								options={organisationsOptions}
								onChange={(value) => {
									this.handlers.publisher(value);
								}}
							/>
						</label>
					</div>
					<div className="col-md-6">
						<label htmlFor="creator" className="w-100">
							{D.creatorTitle}

							<Select
								placeholder=""
								value={
									stampsOptions.find((option) => option.value === creator) || ''
								}
								options={stampsOptions}
								onChange={(value) => {
									this.handlers.creator(value);
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
		stamps: Stores.Stamps.getStampList(state) || [],
	};
};

export default connect(mapStateToProps)(SearchListContainer);
