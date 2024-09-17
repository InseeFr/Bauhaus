import { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import FamilyRoutes from './family';
import SeriesRoutes from './series';
import OperationsRoutes from './operation';
import DocumentRoutes from './document';
import IndicatorRoutes from './indicator';
import SimsRoutes from './sims';
import Menu from '../menu';
import OperationsTreeContainer from '../tree';
import { loadSetup } from '../../redux/actions/operations/utils/setup';

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

export default RootComponent;
