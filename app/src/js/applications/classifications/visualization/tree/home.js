import React from 'react';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import DnDTree from 'js/applications/shared/tree/dnd';
import D from 'js/i18n';
import { CheckSecondLang, useTitle } from 'bauhaus-utilities';

const ClassificationTree = ({ data, prefLabel }) => {
	useTitle(
		D.classificationsTitle,
		D.classificationTreeTitle + ': ' + prefLabel
	);

	return (
		<div>
			<div className="container">
				<PageTitle title={D.classificationTreeTitle} subtitle={prefLabel} />
				<Controls />
				<CheckSecondLang />

				{data.length !== 0 && (
					<div className="row">
						<div className="col-md-12">
							<DnDTree treeData={data} linkPath={(id) => `item/${id}`} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
