import { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loadSetup } from '../../../actions/operations/utils/setup';

import FamilyRoutes from '../../../applications/operations/routes/family';
import SeriesRoutes from '../../../applications/operations/routes/series';
import OperationsRoutes from '../../../applications/operations/routes/operation';
import DocumentRoutes from '../../../applications/operations/routes/document';
import IndicatorRoutes from '../../../applications/operations/routes/indicator';
import SimsRoutes from '../../../applications/operations/routes/sims';
import Menu from '../../../applications/operations/menu';
import OperationsTreeContainer from '../../../applications/operations/tree';

const RootComponent = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadSetup());
	}, [dispatch]);

	const location = useLocation();

	return (
		<>
			<Menu location={location} />
			<FamilyRoutes />
			<SeriesRoutes />
			<OperationsRoutes />
			<IndicatorRoutes />
			<DocumentRoutes />
			<SimsRoutes />
			<Route
				exact
				path="/operations/tree"
				component={OperationsTreeContainer}
			/>
		</>
	);
};

const Routes = () => <Route path="/" component={RootComponent} />;
export default Routes;
