import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	NewButton,
	VerticalMenu, Loading,
} from '@inseefr/wilco';
import D from 'js/i18n';
import { Auth, useTitle, SearchableList, ArrayUtils } from 'bauhaus-utilities';
import api from '../../../remote-api/operations-api';


function IndicatorsHome() {
	useTitle(D.operationsTitle, D.indicatorsTitle)
	const [loading, setLoading] = useState(true);
	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		api.getIndicatorsList().then(payload => setIndicators(ArrayUtils.sortArray('label')(payload))).finally(() => setLoading(false))
	}, [])

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="row">
				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<VerticalMenu>
						<NewButton action="/operations/indicator/create" wrapper={false} />
					</VerticalMenu>
				</Auth.AuthGuard>
				<div className="col-md-8 text-center pull-right operations-list">
					<PageTitle title={D.indicatorsSearchTitle} col={12} offset={0} />
					<SearchableList
						items={indicators}
						childPath="operations/indicator"
						label="label"
						advancedSearch={false}
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
