import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	PageTitle,
	Button,
	SearchableList,
	VerticalMenu,
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as collectionOverviewPropTypes } from 'js/utils/collections/collection-overview';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';

class CollectionsHome extends Component {
	static propTypes = {
		collections: PropTypes.arrayOf(collectionOverviewPropTypes.isRequired),
		permission: permissionOverviewPropTypes.isRequired,
	};

	constructor() {
		super();

		this.handleClick = e => {
			e.preventDefault();
			this.props.history.push('/collection/create');
		};
		this.handleClickExport = e => {
			e.preventDefault();
			this.props.history.push('/collections/export');
		};
		this.handleClickValidate = e => {
			e.preventDefault();
			this.props.history.push('/collections/validation');
		};
	}

	render() {
		const {
			collections,
			permission: { authType, roles },
		} = this.props;
		const authImpl = check(authType);
		const adminOrCreator = authImpl.isAdminOrCollectionCreator(roles);
		const adminOrContributor = authImpl.isAdminOrContributor(roles);
		return (
			<div className="container">
				<div className="row">
					<VerticalMenu>
						{adminOrContributor && (
							<Button
								label={
									<React.Fragment>
										<span
											className="glyphicon glyphicon-plus"
											aria-hidden="true"
										/>
										<span> {D.btnNewFemale}</span>
									</React.Fragment>
								}
								action={this.handleClick}
								col={8}
								offset={2}
							/>
						)}
						<Button
							label={
								<React.Fragment>
									<span
										className="glyphicon glyphicon-export"
										aria-hidden="true"
									/>
									<span> {D.btnExport}</span>
								</React.Fragment>
							}
							action={this.handleClickExport}
							col={8}
							offset={2}
						/>
						{adminOrCreator && (
							<Button
								label={
									<React.Fragment>
										<span
											className="glyphicon glyphicon-ok"
											aria-hidden="true"
										/>
										<span> {D.btnValid}</span>
									</React.Fragment>
								}
								action={this.handleClickValidate}
								col={8}
								offset={2}
							/>
						)}
					</VerticalMenu>
					<div className="col-md-8 centered pull-right">
						<PageTitle title={D.collectionSearchTitle} col={12} offset={0} />
						<SearchableList
							items={collections}
							childPath="collection"
							autoFocus={true}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(CollectionsHome);
