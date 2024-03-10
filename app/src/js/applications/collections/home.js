import React from 'react';
import PropTypes from 'prop-types';
import { PageTitle } from '@inseefr/wilco';
import { propTypes as collectionOverviewPropTypes } from 'js/utils/collections/collection-overview';
import D from 'js/i18n';
import { SearchableList } from 'bauhaus-utilities';
import { Menu } from './menu';

const CollectionsHome = ({ collections }) => {
	return (
		<div className="container">
			<div className="row">
				<Menu />
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
};
CollectionsHome.propTypes = {
	collections: PropTypes.arrayOf(collectionOverviewPropTypes.isRequired),
};

export default CollectionsHome;
