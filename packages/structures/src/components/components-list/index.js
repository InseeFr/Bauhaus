import React, { useState } from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	VerticalMenu,
} from '@inseefr/wilco';
import './component-list.scss';
import { FilterToggleButtons } from 'bauhaus-utilities';
import {
	MEASURE_TYPE,
	DIMENSION_TYPE,
	ATTRIBUTE_TYPE,
} from '../../utils/constants/dsd-components';
import D from '../../i18n/build-dictionary';

const ALL = 'ALL';
function ComponentsList({ items, title, childPath }) {
	const [filter, setFilter] = useState(ALL);
	const filteredItems = items.filter(item => {
		return filter === ALL || item?.type === filter;
	});

	return (
		<div className="container structures-components-list">
			<div className="row">
				<VerticalMenu>
					<NewButton action="/dsds/components/search" wrapper={false} />
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={title} col={12} offset={0} />
					<FilterToggleButtons
						currentValue={filter}
						handleSelection={setFilter}
						options={[
							[ALL, D.all],
							[MEASURE_TYPE, D.measureTitle],
							[DIMENSION_TYPE, D.dimensionTitle],
							[ATTRIBUTE_TYPE, D.attributeTitle],
						]}
					/>
					<SearchableList
						items={filteredItems}
						childPath={childPath}
						label="label"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
}

export default ComponentsList;
