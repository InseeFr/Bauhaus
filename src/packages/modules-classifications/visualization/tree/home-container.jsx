import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTreeFromFlatData } from 'react-sortable-tree';

import { Loading } from '@components/loading';

import { ClassificationsApi } from '@sdk/classification';

import { useClassificationsItem } from '@utils/hooks/classifications';
import { useSecondLang } from '@utils/hooks/second-lang';

import ClassificationTree from './home';

export const Component = () => {
	const [secondLang] = useSecondLang();
	const { id } = useParams();
	const [general, setGeneral] = useState();

	const { isLoading, data: flatTree } = useClassificationsItem(id);

	useEffect(() => {
		ClassificationsApi.getClassificationGeneral(id).then((response) =>
			setGeneral(response),
		);
	}, [id]);

	console.log(general);
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
		/>
	);
};
