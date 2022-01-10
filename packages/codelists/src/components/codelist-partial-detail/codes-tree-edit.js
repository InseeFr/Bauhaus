import React, { useCallback, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Stores } from 'bauhaus-utilities';
import RmesTree from '../tree';
import { TreeContext } from '../tree/treeContext';
import { CodeDetailEdit } from '../code-detail/edit';
import { treedData } from '../../utils';
import { emptyCode } from '../code-detail/empty-code';

export const syncNodes = (previousNodes = [], nextNodes = []) => {
	if (previousNodes.length !== nextNodes.length) {
		return nextNodes;
	}
	return nextNodes.map((node) => {
		const previousNode = previousNodes.find(({ code }) => code === node.code);

		return {
			...node,
			expanded: previousNode?.expanded || false,
			position:
				previousNode?.position ||
				(previousNodes.position ? Math.max(previousNodes.position) + 1 : 1),
			children: syncNodes(previousNode?.children, node.children),
		};
	});
};

const CodesTreeEdit = ({
	codes,
	deleteCode,
	deleteCodeWithChildren,
	updateCode,
	createCode,
}) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const [selectedCode, setSelectedCode] = useState(emptyCode);
	const [tree, setTree] = useContext(TreeContext);

	useEffect(() => {
		const currentTree = treedData(Object.values(codes || {}));
		setTree(syncNodes(tree, currentTree));
		// needs not to depend on tree to allow react-sortable-tree to update "expanded"
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [codes]);

	const seeClickHandler = useCallback(
		(e) => {
			const chosenCode = codes.find(
				(c) => c.code === e.target.parentElement.dataset.componentId
			);
			if (chosenCode) {
				setSelectedCode(chosenCode);
			}
		},
		[codes]
	);

	return (
		<div className="row">
			<div className="col-md-5 form-group">
				<RmesTree
					treeData={tree}
					handleChangeTree={setTree}
					readOnly={false}
					seeClickHandler={seeClickHandler}
				/>
			</div>
			<div className="col-md-7 form-group">
				<CodeDetailEdit
					code={selectedCode}
					codes={codes}
					secondLang={secondLang}
					deleteCode={deleteCode}
					deleteCodeWithChildren={deleteCodeWithChildren}
					updateCode={updateCode}
					createCode={createCode}
				/>
			</div>
		</div>
	);
};

CodesTreeEdit.propTypes = {
	codes: PropTypes.array,
};

export default CodesTreeEdit;
