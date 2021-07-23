import React, { useState, useEffect, useCallback } from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	VerticalMenu,
	Loading,
} from '@inseefr/wilco';
import './component-list.scss';
import { FilterToggleButtons } from 'bauhaus-utilities';
import { MUTUALIZED_COMPONENT_TYPES } from '../../utils/constants/dsd-components';
import { useHistory } from 'react-router-dom';

import { formatLabel } from '../../utils';
import api from '../../apis/structure-api';
import D from '../../i18n/build-dictionary';

const ALL = 'ALL';
const sessionStorageKey = 'components-displayMode';

function ComponentsList() {
	const history = useHistory();
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const queryMode = sessionStorage.getItem(sessionStorageKey);
	const [filter, setFilter] = useState(queryMode || ALL);

	const onFilter = useCallback(
		(mode) => {
			history.push(window.location.pathname + '?page=1');

			setFilter(mode);
		},
		[history]
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
		api
			.getMutualizedComponents()
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
			<div className="row">
				<VerticalMenu>
					<NewButton action={"/structures/components/create?type=" + encodeURIComponent(filter)} wrapper={false} />
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.componentTitle} col={12} offset={0} />
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
						searchUrl="/structures/components/search"
						advancedSearch={true}
						label="label"
						autoFocus={true}
						itemFormatter={(_, component) => formatLabel(component)}
					/>
				</div>
			</div>
		</div>
	);
}

export default ComponentsList;
