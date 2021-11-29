import React, { useState } from 'react';
import { TreeContext } from '../tree/treeContext';
import CodelistPartialEdit from './edit-container';

function CodeListsPartialEditContext() {
	const [tree, setTree] = useState([]);
	return (
		<TreeContext.Provider value={[tree, setTree]}>
			<CodelistPartialEdit />
		</TreeContext.Provider>
	);
}

export default CodeListsPartialEditContext;
