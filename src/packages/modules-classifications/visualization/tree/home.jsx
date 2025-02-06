import { useParams } from 'react-router-dom';

import { CheckSecondLang } from '@components/check-second-lang';
import { Row } from '@components/layout';
import { PageTitle } from '@components/page-title';
import { Tree } from '@components/tree';

import { useTitle } from '@utils/hooks/useTitle';

import D from '../../../deprecated-locales';
import Controls from './controls';

const ClassificationTree = ({ data, prefLabel }) => {
	const { id } = useParams();

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
							<Tree
								treeData={data}
								linkPath={(identifier) =>
									`/classifications/classification/${id}/item/${identifier}`
								}
							/>
						</div>
					</Row>
				)}
			</div>
		</div>
	);
};

export default ClassificationTree;
