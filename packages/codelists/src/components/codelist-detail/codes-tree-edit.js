import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Stores } from 'bauhaus-utilities';
import RmesTree from '../tree';
import { CodeDetailEdit } from '../code-detail/edit';

const CodesTreeEdit = ({ codes, tree, handleChangeTree }) => {
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const [selectedCode, setSelectedCode] = useState(null);

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
			<div className="col-md-6 form-group">
				<RmesTree
					treeData={tree}
					handleChangeTree={handleChangeTree}
					readOnly={false}
					seeClickHandler={seeClickHandler}
				/>
			</div>
			<div className="col-md-6 form-group">
				<CodeDetailEdit
					code={selectedCode}
					codes={codes}
					secondLang={secondLang}
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
