import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SlidingPanel from 'react-sliding-side-panel';
import { Panel } from '@inseefr/wilco';
import { Stores } from 'bauhaus-utilities';
import D from '../../i18n/build-dictionary';
import { CollapsiblePanel } from '../collapsible-panel';
import RmesTree from '../tree';
import { CodeDetailView } from '../code-detail/view';
import CodeTitle from '../code-detail/title';

const PartialCodesTreeEdit = ({
	hidden = false,
	codes,
	tree,
	handleChangeTree,
	readOnly,
}) => {
	const [openPanel, setOpenPanel] = useState(false);
	const secondLang = useSelector(Stores.SecondLang.getSecondLang);
	const [selectedCode, setSelectedCode] = useState(null);

	const seeClickHandler = useCallback(
		(e) => {
			const chosenCode = codes.find(
				(c) => c.code === e.target.parentElement.dataset.componentId
			);
			if (chosenCode) {
				setSelectedCode(chosenCode);
				setOpenPanel(true);
			}
		},
		[codes]
	);

	return (
		<CollapsiblePanel
			id="code-picker"
			hidden={hidden}
			title={D.codesTreeTitle}
			children={
				<>
					<div className="col-md-6 form-group">
						<Panel title={D.partialCodesTreeTitle}>
							<RmesTree
								treeData={tree.filter((code) => code.isPartial)}
								handleChangeTree={() => {}}
								readOnly={true}
							/>
						</Panel>
					</div>
					<div className="col-md-6 form-group">
						<Panel title={D.globalCodesTreeTitle}>
							<RmesTree
								treeData={tree}
								handleChangeTree={handleChangeTree}
								readOnly={readOnly}
								seeClickHandler={seeClickHandler}
								addHandler={() => {}}
								removeHandler={() => {}}
							/>
						</Panel>
						<SlidingPanel
							type={'left'}
							isOpen={openPanel}
							size={60}
							backdropClicked={() => setOpenPanel(false)}
						>
							<CodeTitle code={selectedCode} secondLang={secondLang} />
							<CodeDetailView
								code={selectedCode}
								codes={codes}
								secondLang={secondLang}
								handleBack={() => {
									setOpenPanel(false);
								}}
							/>
						</SlidingPanel>
					</div>
				</>
			}
		/>
	);
};

PartialCodesTreeEdit.propTypes = {
	hidden: PropTypes.bool,
	codes: PropTypes.array,
	tree: PropTypes.array.isRequired,
	handleChangeTree: PropTypes.func.isRequired,
	readOnly: PropTypes.bool,
};

export default PartialCodesTreeEdit;
