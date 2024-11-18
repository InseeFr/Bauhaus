import Controls from './controls';
import D from '../../../deprecated-locales';
import { Tree } from '../../../components/tree';
import { useTitle } from '@utils/hooks/useTitle';
import { PageTitle } from '@components/page-title';
import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';

const ClassificationTree = ({ data, prefLabel }) => {
	useTitle(
		D.classificationsTitle,
		D.classificationTreeTitle + ': ' + prefLabel,
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
