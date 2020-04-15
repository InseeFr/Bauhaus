import React from 'react';
import {
	NewButton,
	SearchableList,
	PageTitle,
	VerticalMenu,
} from '@inseefr/wilco';
import './component-list.scss';

function ComponentsList({ items, title, childPath }) {
	return (
		<div className="container structures-components-list">
			<div className="row">
				<VerticalMenu>
					<NewButton action="/dsds/components/search" wrapper={false} />
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={title} col={12} offset={0} />
					<SearchableList
						items={items}
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
