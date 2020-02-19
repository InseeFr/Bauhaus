import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
	PageTitle,
	SearchRmes,
	NewButton,
	PublishButton,
	ExportButton,
	VerticalMenu,
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as conceptOverviewPropTypes } from 'js/utils/concepts/concept-overview';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';

class ConceptsHome extends Component {
	constructor() {
		super();

		this.handleClick = e => {
			e.preventDefault();
			this.props.history.push('/concept/create');
		};
		this.handleClickExport = e => {
			e.preventDefault();
			this.props.history.push('/concepts/export');
		};
		this.handleClickValidate = e => {
			e.preventDefault();
			this.props.history.push('/concepts/validation');
		};
	}

	render() {
		const {
			concepts,
			permission: { authType, roles },
		} = this.props;
		const authImpl = check(authType);
		const adminOrContributor = authImpl.isAdminOrContributor(roles);
		const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);
		return (
			<div className="container">
				<div className="row">
					<VerticalMenu>
						{adminOrContributor && (
							<NewButton action={this.handleClick} col={8} offset={2} />
						)}
						<ExportButton action={this.handleClickExport} col={8} offset={2} />
						{adminOrCreator && (
							<PublishButton
								action={this.handleClickValidate}
								col={8}
								offset={2}
							/>
						)}
					</VerticalMenu>
					<div className="col-md-8 centered pull-right">
						<PageTitle title={D.conceptSearchTitle} col={12} offset={0} />
						<SearchRmes
							items={concepts}
							childPath="concept"
							advancedSearch
							searchUrl="/concepts/search"
							placeholder={D.searchLabelHomePlaceholder}
							autoFocus={true}
						/>
					</div>
				</div>
			</div>
		);
	}
}

ConceptsHome.propTypes = {
	concepts: PropTypes.arrayOf(conceptOverviewPropTypes.isRequired),
	permission: permissionOverviewPropTypes.isRequired,
};

export default withRouter(ConceptsHome);
