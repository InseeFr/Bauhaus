import { useEffect } from 'react';
import { connect } from 'react-redux';
import ClassificationTree from './home';
import { buildExtract } from '@inseefr/wilco';
import { Loading } from '../../../../new-architecture/components';

import loadClassificationGeneral from '../../../../actions/classifications/general';
import * as selectG from '../../../../reducers/classifications/classification/general';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { Stores } from '../../../../utils';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../../../new-architecture/sdk/classification';

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
	const general = selectG.getGeneral(state.classificationGeneral, id);
	const secondLang = Stores.SecondLang.getSecondLang(state);
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
