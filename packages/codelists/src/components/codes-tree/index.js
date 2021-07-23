import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import SlidingPanel from 'react-sliding-side-panel';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import { CodeDetail } from '../code-detail';
import RmesTree from '../tree';

const CodesTree = ({ hidden = false, codes, tree, handleAdd }) => {
	const [openPanel, setOpenPanel] = useState(false);
	const [selectedCode, setSelectedCode] = useState(null);

	const seeClickHandler = useCallback(
		(e) => {
			const code = codes.find((c) => c.id === e.id);
			setSelectedCode(code);
			setOpenPanel(true);
		},
		[codes]
	);

	/* const addClickHandler = useCallback(
		(e) => {
			handleAdd(e.id);
		},
		[handleAdd]
	); */

	return (
		<CollapsiblePanel id="code-picker" hidden={hidden} title={D.codesTitle}>
			<RmesTree treeData={tree} seeClickHandler={seeClickHandler} />
			<SlidingPanel
				type={'right'}
				isOpen={openPanel}
				size={60}
				backdropClicked={() => setOpenPanel(false)}
			>
				<CodeDetail
					code={selectedCode}
					handleSave={() => {}}
					handleBack={() => {
						setOpenPanel(false);
					}}
				/>
			</SlidingPanel>
		</CollapsiblePanel>
	);
};

CodesTree.propTypes = {
	hidden: PropTypes.bool,
	codes: PropTypes.array,
	tree: PropTypes.array,
	handleAdd: PropTypes.bool,
};

export default CodesTree;
