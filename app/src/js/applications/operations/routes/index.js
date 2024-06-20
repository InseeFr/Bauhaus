import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loadSetup } from 'js/actions/operations/utils/setup';

import FamilyRoutes from 'js/applications/operations/routes/family';
import SeriesRoutes from 'js/applications/operations/routes/series';
import OperationsRoutes from 'js/applications/operations/routes/operation';
import DocumentRoutes from 'js/applications/operations/routes/document';
import IndicatorRoutes from 'js/applications/operations/routes/indicator';
import SimsRoutes from 'js/applications/operations/routes/sims';
import Menu from 'js/applications/operations/menu';
import OperationsTreeContainer from 'js/applications/operations/tree';

const RootComponent = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadSetup());
	}, [dispatch]);

	return (
		<>
			<Menu />
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

export default () => <Route path="/" component={RootComponent} />;
