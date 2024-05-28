import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import D from 'js/i18n';
import { useTitle, SearchableList } from 'js/utils';

const CorrespondencesHome = ({ correspondences }) => {
	useTitle(D.classificationsTitle, D.correspondencesTitle);
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-8 col-md-offset-2 text-center">
					<PageTitle title={D.correspondencesSearchTitle} col={12} offset={0} />
					<SearchableList
						items={correspondences}
						childPath="classifications/correspondence"
						autoFocus={true}
					/>
				</div>
			</div>
		</div>
	);
};

export default CorrespondencesHome;
