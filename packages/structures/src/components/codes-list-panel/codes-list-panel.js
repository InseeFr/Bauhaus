import React, {useState, useEffect} from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { CodesList, ArrayUtils } from 'bauhaus-utilities';
import "./codes-list-panel.scss"
import {
	CancelButton,
	ActionToolbar,
} from '@inseefr/wilco';

const sortByLabel = ArrayUtils.sortArray('labelLg1');

export const CodesListPanel = props => <CodesListPanelDumb {...props} getCodesList={CodesList.getCodesList}/>
export const CodesListPanelDumb = ({ isOpen, handleBack, codesList, getCodesList }) => {
	const [codes, setCodes] = useState([])
	useEffect(() => {
		if(codesList && isOpen){
			getCodesList(codesList.notation).then((response) => {
				setCodes(sortByLabel(response.codes || []))
			});
		}
	}, [codesList, isOpen, getCodesList])
	return (
		<SlidingPanel panelClassName="codes-list-panel" type={'right'} isOpen={isOpen} size={30} >
			<ActionToolbar>
				<CancelButton type="button" action={handleBack} col={12} />
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
