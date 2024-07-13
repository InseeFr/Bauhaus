import { useEffect, useState } from 'react';
import { VerticalMenu } from '@inseefr/wilco';
import { PageTitle, Loading } from '../../../new-architecture/components';

import D from '../../../i18n';
import {
	Auth,
	useTitle,
	SearchableList,
	ArrayUtils,
	MasculineButton,
} from '../../../utils';
import api from '../../../remote-api/operations-api';

function IndicatorsHome() {
	useTitle(D.operationsTitle, D.indicatorsTitle);
	const [loading, setLoading] = useState(true);
	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		api
			.getAllIndicators()
			.then((payload) => setIndicators(ArrayUtils.sortArray('label')(payload)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="row">
				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					<VerticalMenu>
						<MasculineButton action="/operations/indicator/create" />
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

export default IndicatorsHome;
