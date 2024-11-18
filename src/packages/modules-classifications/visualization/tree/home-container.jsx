import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getTreeFromFlatData } from 'react-sortable-tree';

import { Loading } from '@components/loading';

import { useClassificationsItem } from '@utils/hooks/classifications';
import { useSecondLang } from '@utils/hooks/second-lang';

import loadClassificationGeneral from '../../../redux/actions/classifications/general';
import { getGeneral } from '../../../redux/classifications/classification/general';
import ClassificationTree from './home';

const ClassificationTreeContainer = ({
	id,
	loadClassificationGeneral,
	general,
}) => {
	const [secondLang] = useSecondLang();
	const { isLoading, data: flatTree } = useClassificationsItem(id);

	useEffect(() => {
		loadClassificationGeneral(id);
	}, [id, loadClassificationGeneral]);

	if (isLoading || !general) return <Loading />;

	const { prefLabelLg1, prefLabelLg2 } = general;
	const label = secondLang ? 'labelLg2' : 'labelLg1';
	const data =
		(flatTree.length !== 0 &&
			flatTree[0][label] &&
			getTreeFromFlatData({
				flatData: flatTree.map((n) => ({
					id: n.id,
					label: n[label] ? `${n.id} - ${n[label]}` : n.id,
					parent: n.parent || null,
				})),
				getKey: (node) => node.id,
				getParentKey: (node) => node.parent,
				rootKey: null,
			})) ||
		[];

	return (
		<ClassificationTree
			prefLabel={secondLang ? prefLabelLg2 : prefLabelLg1}
			data={data}
			secondLang={secondLang}
		/>
	);
};

const mapStateToProps = (state, ownProps) => {
	const id = ownProps.params.id;
	const general = getGeneral(state.classificationGeneral, id);
	return {
		id,
		general,
	};
};

const mapDispatchToProps = {
	loadClassificationGeneral,
};

const withParams = (Component) => {
	return (props) => {
		const params = useParams();
		return <Component {...props} params={params} />;
	};
};

export const Component = withParams(
	connect(mapStateToProps, mapDispatchToProps)(ClassificationTreeContainer),
);
