import Controls from './controls';
import D from '../../../../i18n';
import { CheckSecondLang, useTitle } from '../../../../utils';
import { PageTitle, Row, Tree } from '../../../../new-architecture/components';

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
							<Tree treeData={data} linkPath={(id) => `item/${id}`} />
						</div>
					</Row>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
