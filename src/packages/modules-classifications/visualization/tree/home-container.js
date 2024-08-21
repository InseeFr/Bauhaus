import { useEffect } from 'react';
import { connect } from 'react-redux';
import ClassificationTree from './home';
import { buildExtract } from '@inseefr/wilco';
import { Loading } from '../../../components';

import loadClassificationGeneral from '../../../redux/actions/classifications/general';
import { getGeneral } from '../../../redux/classifications/classification/general';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../..//sdk/classification';
import { getSecondLang } from '../../../redux/second-lang';

const extractId = buildExtract('id');

const ClassificationTreeContainer = ({
	id,
	loadClassificationGeneral,
	general,
	secondLang,
}) => {
	const { isLoading, data: flatTree } = useQuery({
		queryKey: ['classification-items', id],
		queryFn: () => ClassificationsApi.getClassificationItems(id),
	});

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
	const id = extractId(ownProps);
	const general = getGeneral(state.classificationGeneral, id);
	const secondLang = getSecondLang(state);
	return {
		id,
		general,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadClassificationGeneral,
};

const ClassificationTreeReduxContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ClassificationTreeContainer);

export default ClassificationTreeReduxContainer;
