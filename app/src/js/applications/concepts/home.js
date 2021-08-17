import React  from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	SearchableList,
	NewButton,
	PublishButton,
	ExportButton,
	VerticalMenu,
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as conceptOverviewPropTypes } from 'js/utils/concepts/concept-overview';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';

const ConceptsHome = ({
	concepts,
	permission: { authType, roles }
}) => {
	const authImpl = check(authType);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);
	const adminOrCreator = authImpl.isAdminOrConceptCreator(roles);
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					{adminOrContributor && (
						<NewButton action="/concept/create" col={8} offset={2} />
					)}
					<ExportButton action="/concepts/export" col={8} offset={2} />
					{adminOrCreator && (
						<PublishButton
							action="/concepts/validation"
							col={8}
							offset={2}
						/>
					)}
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
					<PageTitle title={D.conceptSearchTitle} col={12} offset={0} />
					<SearchableList
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
ConceptsHome.propTypes = {
	concepts: PropTypes.arrayOf(conceptOverviewPropTypes.isRequired),
	permission: permissionOverviewPropTypes.isRequired,
};

export default ConceptsHome;
