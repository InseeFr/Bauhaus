import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import D from 'js/i18n';
import { SearchableList, useTitle } from 'bauhaus-utilities';
import { Menu } from './menu';

const CollectionsHome = ({ collections }) => {
	useTitle(D.conceptsTitle, D.collectionsTitle);
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

export default CollectionsHome;
