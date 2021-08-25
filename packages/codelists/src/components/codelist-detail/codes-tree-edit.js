import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Stores } from 'bauhaus-utilities';
import RmesTree from '../tree';
import { CodeDetailEdit } from '../code-detail/edit';
import { treedData } from '../../utils';

const CodesTreeEdit = ({ codes,deleteCode, deleteCodeWithChildren, updateCode, createCode }) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const [selectedCode, setSelectedCode] = useState(null);

	const [tree, setTree] = useState({});

	useEffect(() => {

		const currentTree = treedData(Object.values(codes || {}));

		function syncNodes(previousNodes = [], nextNodes = []){
			return nextNodes.map((node) => {
				const previousNode = previousNodes.find(({ code }) => code === node.code);

				return {
					...node,
					expanded: previousNode?.expanded || false,
					children: syncNodes(previousNode?.children, node.children)
				}
			})
		}
		setTree(syncNodes(tree, currentTree))
	}, [codes]);

	console.log(tree)
	const seeClickHandler = useCallback(
		(e) => {
			const chosenCode = codes.find(
				(c) => c.code === e.target.parentElement.dataset.componentId
			);
			setSelectedCode(chosenCode);
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
	tree: PropTypes.array.isRequired,
	handleChangeTree: PropTypes.func.isRequired,
};

export default CodesTreeEdit;
