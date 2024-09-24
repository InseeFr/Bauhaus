import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import OperationsFamiliesContainer from '../../modules-operations/families/';
import OperationsFamilyEditionContainer from '../../modules-operations/families/edition';
import OperationsFamiliesSearchContainer from '../../modules-operations/families/search';
import OperationsFamilyVisualizationContainer from '../../modules-operations/families/visualization/';
import MSDContainer, {
	CREATE,
	DUPLICATE,
	UPDATE,
	VIEW,
} from '../../modules-operations/msd/';
import OperationsSeriesContainer from '../../modules-operations/series/';
import OperationsSeriesEditionContainer from '../../modules-operations/series/edition';
import OperationsSeriesSearchContainer from '../../modules-operations/series/search';
import OperationsSeriesVisualizationContainer from '../../modules-operations/series/visualization/';
import { loadSetup } from '../../redux/actions/operations/utils/setup';
import Menu from '../menu';
import OperationsTreeContainer from '../tree';

import OperationsDocumentsContainer from '../../modules-operations/document/';
import OperationsDocumentationEditionContainer from '../../modules-operations/document/edition';
import DocumentationVisualizationContainer from '../../modules-operations/document/visualization';
import OperationsIndicatorsContainer from '../../modules-operations/indicators/';
import OperationsIndicatorEditionContainer from '../../modules-operations/indicators/edition';
import OperationIndicatorContainer from '../../modules-operations/indicators/visualization/';
import OperationsContainer from '../../modules-operations/operations/';
import OperationEditionContainer from '../../modules-operations/operations/edition';
import OperationVisualizationContainer from '../../modules-operations/operations/visualization/';

const RootComponent = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(loadSetup());
	}, [dispatch]);

	const location = useLocation();

	return (
		<>
			<Menu location={location} />
			<Routes>
				<Route
					path="/"
					element={<Navigate to="/operations/series" replace />}
				/>
				<Route path="/families" element={<OperationsFamiliesContainer />} />
				<Route
					path="/families/search"
					element={<OperationsFamiliesSearchContainer />}
				/>
				<Route
					path="/family/create"
					element={<OperationsFamilyEditionContainer />}
				/>
				<Route
					path="/family/:id"
					element={<OperationsFamilyVisualizationContainer />}
				/>
				<Route
					path="/family/:id/modify"
					element={<OperationsFamilyEditionContainer />}
				/>

				<Route path="/series" element={<OperationsSeriesContainer />} />
				<Route
					path="/series/search"
					element={<OperationsSeriesSearchContainer />}
				/>
				<Route
					path="/series/create"
					element={<OperationsSeriesEditionContainer />}
				/>
				<Route
					path="/series/:id"
					element={<OperationsSeriesVisualizationContainer />}
				/>
				<Route
					path="/series/:id/modify"
					element={<OperationsSeriesEditionContainer />}
				/>

				<Route path="/operations" element={<OperationsContainer />} />

				<Route
					path="/operation/create"
					element={<OperationEditionContainer />}
				/>
				<Route
					path="/operation/:id"
					element={<OperationVisualizationContainer />}
				/>
				<Route
					path="/operation/:id/modify"
					element={<OperationEditionContainer />}
				/>

				<Route path="/indicators" element={<OperationsIndicatorsContainer />} />
				<Route
					path="/indicator/create"
					element={<OperationsIndicatorEditionContainer />}
				/>

				<Route
					path="/indicator/:id"
					element={<OperationIndicatorContainer />}
				/>
				<Route
					path="/indicator/:id/modify"
					element={<OperationsIndicatorEditionContainer />}
				/>
				<Route path="/documents" element={<OperationsDocumentsContainer />} />
				<Route
					path="/link/create"
					element={<OperationsDocumentationEditionContainer />}
				/>
				<Route
					path="/document/create"
					element={<OperationsDocumentationEditionContainer />}
				/>

				<Route
					path="/document/:id"
					element={<DocumentationVisualizationContainer />}
				/>
				<Route
					path="/document/:id/modify"
					element={<OperationsDocumentationEditionContainer />}
				/>
				<Route
					path="/link/:id"
					element={<DocumentationVisualizationContainer />}
				/>
				<Route
					path="/link/:id/modify"
					element={<OperationsDocumentationEditionContainer />}
				/>
				<Route path="/msd" element={<MSDContainer />} />
				<Route path="/help/:idSection" element={<MSDContainer />} />
				<Route
					path="/operation/:idParent/sims/create"
					element={
						<MSDContainer
							mode={CREATE}
							disableSectionAnchor
							parentType="operation"
						/>
					}
				/>
				<Route
					path="/series/:idParent/sims/create"
					element={
						<MSDContainer
							mode={CREATE}
							disableSectionAnchor
							parentType="series"
						/>
					}
				/>

				<Route
					path="/indicator/:idParent/sims/create"
					element={
						<MSDContainer
							mode={CREATE}
							disableSectionAnchor
							parentType="indicator"
						/>
					}
				/>

				<Route path="/sims/:id" element={<MSDContainer mode={VIEW} />} />
				<Route
					path="/sims/:id/modify"
					element={<MSDContainer mode={UPDATE} disableSectionAnchor />}
				/>
				<Route
					path="/sims/:id/duplicate"
					element={<MSDContainer mode={DUPLICATE} disableSectionAnchor />}
				/>
				<Route
					path="/sims/:id/section/:idSection"
					element={<MSDContainer mode={VIEW} />}
				/>

				<Route path="/tree" element={<OperationsTreeContainer />} />
			</Routes>
		</>
	);
};

export default RootComponent;
