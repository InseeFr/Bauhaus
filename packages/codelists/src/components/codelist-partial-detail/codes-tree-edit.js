import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SlidingPanel from 'react-sliding-side-panel';
import { ActionToolbar, Panel } from '@inseefr/wilco';
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
	addClickHandler,
	removeClickHandler,
	addAllClickHandler,
	removeAllClickHandler,
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
				<React.Fragment>
					<ActionToolbar>
						<button
							type="button"
							onClick={addAllClickHandler}
							className="btn wilco-btn btn-lg col-md-6"
						>
							<span
								className="glyphicon glyphicon-plus"
								aria-hidden="true"
							></span>
							<span>{D.addAll}</span>
						</button>
						<button
							type="button"
							onClick={removeAllClickHandler}
							className="btn wilco-btn btn-lg col-md-6"
						>
							<span
								className="glyphicon glyphicon-minus"
								aria-hidden="true"
							></span>
							<span>{D.removeAll}</span>
						</button>
					</ActionToolbar>
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
								readOnly={true}
								seeClickHandler={seeClickHandler}
								addHandler={addClickHandler}
								removeHandler={removeClickHandler}
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
				</React.Fragment>
			}
		/>
	);
};

PartialCodesTreeEdit.propTypes = {
	hidden: PropTypes.bool,
	codes: PropTypes.array,
	tree: PropTypes.array.isRequired,
	handleChangeTree: PropTypes.func.isRequired,
	addClickHandler: PropTypes.func.isRequired,
	removeClickHandler: PropTypes.func.isRequired,
	addAllClickHandler: PropTypes.func.isRequired,
	removeAllClickHandler: PropTypes.func.isRequired,
};

export default PartialCodesTreeEdit;
