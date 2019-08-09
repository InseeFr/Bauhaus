import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OperationsDocumentsContainer from 'js/components/operations/document/';
import OperationsDocumentationEditionContainer from 'js/components/operations/document/edition';
import DocumentationVisualizationContainer from 'js/components/operations/document/visualization';

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
		</Switch>
	);
};
