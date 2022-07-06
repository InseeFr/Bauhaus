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
import { SearchableList} from 'bauhaus-utilities';

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
							action="/collection/create"
							col={8}
							offset={2}
						/>
					)}
					<ExportButton action="/collections/export" col={8} offset={2} />
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
							col={8}
							offset={2}
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
