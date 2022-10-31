import React, {useState, useEffect} from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { CodesList, ArrayUtils } from 'bauhaus-utilities';
import "./codes-list-panel.scss"
import {
	ActionToolbar,
} from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';

const sortByLabel = ArrayUtils.sortArray('labelLg1');

export const CodesListPanel = props => <CodesListPanelDumb {...props} getCodesList={CodesList.getCodesList} getPartialCodesList={CodesList.getPartialCodesList}/>
export const CodesListPanelDumb = ({ isOpen, handleBack, codesList, getCodesList, getPartialCodesList }) => {
	const [codes, setCodes] = useState([])
	useEffect(() => {
		if(codesList && isOpen){

			Promise.all([
				getCodesList(codesList.notation),
				getPartialCodesList(codesList.notation)
			]).then(([ codesList, partialCodesList]) => {

				const codes = codesList.codes ?? Object.values(partialCodesList.codes ?? {}) ?? []
				setCodes(sortByLabel(codes || []))
			})
		}
	}, [codesList, isOpen, getCodesList])
	return (
		<SlidingPanel panelClassName="codes-list-panel" type={'right'} isOpen={isOpen} size={30} >
			<ActionToolbar>
				<div className="col-md-12">
				<button
					type="button"
					className="btn wilco-btn btn-lg col-md-12"
					onClick={handleBack}
				>
					{ D.btnCancel }
				</button>
				</div>
			</ActionToolbar>
			<ul className="list-group">
				{codes.map(({ code, labelLg1 }) => {
					return (
						<li className="list-group-item" key={code}>
							{code} - {labelLg1}
						</li>
					)
				})}

			</ul>
		</SlidingPanel>
	)
}
