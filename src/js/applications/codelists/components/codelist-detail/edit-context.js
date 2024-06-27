import { useState } from 'react';
import { TreeContext } from '../tree/treeContext';
import CodelistEdit from './edit-container';

function CodeListsEditContext() {
	const [tree, setTree] = useState([]);
	return (
		<TreeContext.Provider value={[tree, setTree]}>
			<CodelistEdit />
		</TreeContext.Provider>
	);
}

export default CodeListsEditContext;
