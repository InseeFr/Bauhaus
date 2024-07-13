import { PageTitle } from '../../../../new-architecture/components';
import Controls from './controls';
import DnDTree from '../../../../applications/shared/tree/dnd';
import D from '../../../../i18n';
import { CheckSecondLang, Row, useTitle } from '../../../../utils';

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
					<Row>
						<div className="col-md-12">
							<DnDTree treeData={data} linkPath={(id) => `item/${id}`} />
						</div>
					</Row>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
