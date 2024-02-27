import React  from 'react';
import PropTypes from 'prop-types';
import {
	PageTitle,
	Button,
	VerticalMenu,
	ExportButton,
} from '@inseefr/wilco';
import check from 'js/utils/auth';
import { propTypes as collectionOverviewPropTypes } from 'js/utils/collections/collection-overview';
import { propTypes as permissionOverviewPropTypes } from 'js/utils/auth/permission-overview';
import D from 'js/i18n';
import { SearchableList, FeminineButton} from 'bauhaus-utilities';

const CollectionsHome = ({
			 collections,
			 permission: { authType, roles },
		 }) => {

	const authImpl = check(authType);
	const adminOrCreator = authImpl.isAdminOrCollectionCreator(roles);
	const adminOrContributor = authImpl.isAdminOrContributor(roles);
	return (
		<div className="container">
			<div className="row">
				<VerticalMenu>
					{adminOrContributor && (
						<FeminineButton action="/collection/create" />
					)}
					<ExportButton action="/collections/export" wrapper={false} />
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
							action="/collections/validation"
							wrapper={false}
						/>
					)}
				</VerticalMenu>
				<div className="col-md-8 text-center pull-right">
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
CollectionsHome.propTypes = {
	collections: PropTypes.arrayOf(collectionOverviewPropTypes.isRequired),
	permission: permissionOverviewPropTypes.isRequired,
};

export default CollectionsHome;
