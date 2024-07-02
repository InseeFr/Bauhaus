import { Switch, Route } from 'react-router-dom';
import OperationsDocumentsContainer from 'js/applications/operations/document/';
import OperationsDocumentationEditionContainer from 'js/applications/operations/document/edition';
import DocumentationVisualizationContainer from 'js/applications/operations/document/visualization';

export default () => {
	return (
		<Switch>
			<Route
				exact
				path="/operations/documents"
				component={OperationsDocumentsContainer}
			/>
			<Route
				exact
				path="/operations/(link|document)/create"
				component={OperationsDocumentationEditionContainer}
			/>

			<Route
				exact
				path="/operations/document/:id"
				component={DocumentationVisualizationContainer}
			/>
			<Route
				exact
				path="/operations/document/:id/modify"
				component={OperationsDocumentationEditionContainer}
			/>
			<Route
				exact
				path="/operations/link/:id"
				component={DocumentationVisualizationContainer}
			/>
			<Route
				exact
				path="/operations/link/:id/modify"
				component={OperationsDocumentationEditionContainer}
			/>
		</Switch>
	);
};
