import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FilterToggleButtons from '@components/filter-toggle-buttons';
import { Row } from '@components/layout';
import { Loading } from '@components/loading';
import { PageTitle } from '@components/page-title';
import { SearchableList } from '@components/searchable-list';

import { StructureApi } from '@sdk/index';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../i18n/build-dictionary';
import { formatLabel } from '../../utils';
import { MUTUALIZED_COMPONENT_TYPES } from '../../utils/constants';
import './component-list.css';
import { HomePageMenu } from './menu';

const ALL = 'ALL';
const sessionStorageKey = 'components-displayMode';

export const Component = () => {
	useTitle(D.structuresTitle, D.componentTitle);

	const navigate = useNavigate();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const queryMode = sessionStorage.getItem(sessionStorageKey);
	const [filter, setFilter] = useState(queryMode || ALL);

	const onFilter = useCallback(
		(mode) => {
			navigate(window.location.pathname + '?page=1');

			setFilter(mode);
		},
		[navigate],
	);

	useEffect(() => {
		sessionStorage.setItem(sessionStorageKey, filter);
	}, [filter]);

	const filteredItems = items
		.filter((item) => {
			return filter === ALL || item?.type === filter;
		})
		.map(({ id, labelLg1, labelLg2 }) => ({ id, labelLg1, labelLg2 }));

	useEffect(() => {
		StructureApi.getMutualizedComponents()
			.then((components) => {
				setItems(components);
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return <Loading />;
	}
	return (
		<div className="container structures-components-list">
			<Row>
				<HomePageMenu filter={filter} />
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.componentHomePageTitle} col={12} offset={0} />
					<FilterToggleButtons
						currentValue={filter}
						handleSelection={onFilter}
						options={[
							[ALL, D.all],
							...MUTUALIZED_COMPONENT_TYPES.map((type) => [
								type.value,
								type.labelPlural,
							]),
						]}
					/>
					<SearchableList
						items={filteredItems}
						childPath="structures/components"
						advancedSearch
						searchUrl="/structures/components/search"
						autoFocus
						itemFormatter={(_, component) => formatLabel(component)}
					/>
				</div>
			</Row>
		</div>
	);
};
