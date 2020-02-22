import React from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	SearchableList,
	NewButton,
	VerticalMenu,
} from '@inseefr/wilco';
import D from 'js/i18n';
import Auth from 'js/utils/auth/components/auth';
import { ADMIN, INDICATOR_CONTRIBUTOR } from 'js/utils/auth/roles';

function IndicatorsHome({ indicators }) {
	return (
		<div className="container">
			<div className="row">
				<Auth roles={[ADMIN, INDICATOR_CONTRIBUTOR]}>
					<VerticalMenu>
						<NewButton action="/operations/indicator/create" wrapper={false} />
					</VerticalMenu>
				</Auth>
				<div className="col-md-8 centered pull-right operations-list">
					<PageTitle title={D.indicatorsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={indicators}
						childPath="operations/indicator"
						label="label"
						advancedSearch
						searchUrl="/operations/indicators/search"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
}

IndicatorsHome.propTypes = {
	indicators: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}).isRequired
	),
};

export default IndicatorsHome;
