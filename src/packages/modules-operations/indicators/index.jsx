import { useEffect, useState } from 'react';
import D from '../../deprecated-locales';
import { SearchableList, PageTitle, Loading } from '../../components';
import { useTitle } from '../../utils/hooks/useTitle';
import { OperationsApi } from '../../sdk/operations-api';
import { sortArray } from '../../utils/array-utils';
import { Menu } from './menu';

function IndicatorsHome() {
	useTitle(D.operationsTitle, D.indicatorsTitle);
	const [loading, setLoading] = useState(true);
	const [indicators, setIndicators] = useState([]);

	useEffect(() => {
		OperationsApi.getAllIndicators()
			.then((payload) => setIndicators(sortArray('label')(payload)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="container">
			<div className="row">
				<Menu></Menu>
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
