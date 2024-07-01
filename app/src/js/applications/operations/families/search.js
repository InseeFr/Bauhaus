import D from 'js/i18n';
import { Link, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from 'js/remote-api/operations-api';

import {
	ArrayUtils,
	AbstractAdvancedSearchComponent,
	AdvancedSearchList,
	useTitle,
	useUrlQueryParameters,
} from 'js/utils';
import { Loading } from 'js/new-architecture/components/loading/loading';

const filterLabel = ArrayUtils.filterKeyDeburr(['prefLabelLg1']);
const fields = ['prefLabelLg1'];
const sortByLabel = ArrayUtils.sortArray('prefLabelLg1');

const defaultState = {
	prefLabelLg1: '',
};

class SearchFormList extends AbstractAdvancedSearchComponent {
	constructor(props) {
		super(props, {
			...defaultState,
			...props.search,
		});
	}

	handlers = this.handleChange(fields, (newState) => {
		const { prefLabelLg1 } = newState;
		this.props.setSearch({ prefLabelLg1 });
	});

	render() {
		const {
			data,
			search: { prefLabelLg1 },
			reset,
		} = this.props;
		const filteredData = data.filter(filterLabel(prefLabelLg1));

		const dataLinks = filteredData.map(({ id, prefLabelLg1 }) => (
			<li key={id} className="list-group-item">
				<Link to={`/operations/family/${id}`}>{prefLabelLg1}</Link>
			</li>
		));
		return (
			<AdvancedSearchList
				title={D.familiesSearchTitle}
				data={dataLinks}
				initializeState={reset}
				redirect={<Redirect to={'/operations/families'} push />}
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
			</AdvancedSearchList>
		);
	}
}

const SearchListWithUrlQueryParameter = ({ data }) => {
	const [search, setSearch, reset] = useUrlQueryParameters(defaultState);
	return (
		<SearchFormList
			data={data}
			search={search}
			setSearch={setSearch}
			reset={reset}
		/>
	);
};

const SearchListContainer = () => {
	useTitle(D.familiesTitle + ' - ' + D.operationsTitle, D.advancedSearch);
	const [data, setData] = useState();

	useEffect(() => {
		api.getAllFamiliesForAdvancedSearch().then((data) => {
			setData(sortByLabel(data));
		});
	}, []);

	if (!data) {
		return <Loading />;
	}
	return <SearchListWithUrlQueryParameter data={data} />;
};

export default SearchListContainer;
