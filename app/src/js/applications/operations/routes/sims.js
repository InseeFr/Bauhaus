import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MSDContainer, {
	CREATE,
	VIEW,
	UPDATE,
	DUPLICATE,
} from 'js/applications/operations/msd/';

export default () => {
	return (
		<Switch>
			<Route exact path="/operations/msd" component={MSDContainer} />
			<Route
				exact
				path="/operations/help/:idSection"
				component={MSDContainer}
			/>
			<Route
				exact
				path="/operations/(operation|series|indicator)/:idParent/sims/create"
				render={props => {
					return (
						<MSDContainer
							mode={CREATE}
							baseUrl={`/operations/${props.match.params[0]}/${
								props.match.params.idParent
							}/sims/create`}
							disableSectionAnchor
						/>
					);
				}}
			/>
			<Route
				exact
				path="/operations/sims/:id"
				render={props => (
					<MSDContainer
						mode={VIEW}
						baseUrl={`/operations/sims/${props.match.params.id}/section/`}
					/>
				)}
			/>
			<Route
				exact
				path="/operations/sims/:id/modify"
				render={props => (
					<MSDContainer
						mode={UPDATE}
						disableSectionAnchor
						baseUrl={`/operations/sims/${props.match.params.id}/modify`}
					/>
				)}
			/>
			<Route
				exact
				path="/operations/sims/:id/duplicate"
				render={props => (
					<MSDContainer
						mode={DUPLICATE}
						disableSectionAnchor
						baseUrl={`/operations/sims/${props.match.params.id}/duplicate`}
					/>
				)}
			/>
			<Route
				exact
				path="/operations/sims/:id/section/:idSection"
				render={props => (
					<MSDContainer
						mode={VIEW}
						baseUrl={`/operations/sims/${props.match.params.id}/section/`}
					/>
				)}
			/>
		</Switch>
	);
};
