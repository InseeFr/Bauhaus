import { useState, useEffect } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { CodeListApi } from '../../../sdk';
import './codes-list-panel.scss';
import { ActionToolbar } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';
import { sortArray } from '../../../utils/array-utils';

const sortByLabel = sortArray('labelLg1');

export const CodesListPanel = ({ isOpen, handleBack, codesList }) => {
	const [codes, setCodes] = useState([]);
	const notation = codesList?.notation;

	useEffect(() => {
		if (notation && isOpen) {
			CodeListApi.getCodesListCodes(notation, 1, 0).then((codes) => {
				setCodes(sortByLabel(codes?.codes || []));
			});
		}
	}, [notation, isOpen]);
	return (
		<SlidingPanel
			panelClassName="codes-list-panel"
			type={'right'}
			isOpen={isOpen}
			size={30}
		>
			<ActionToolbar>
				<div className="col-md-12">
					<button
						type="button"
						className="btn wilco-btn btn-lg col-md-12"
						onClick={handleBack}
					>
						{D.btnCancel}
					</button>
				</div>
			</ActionToolbar>
			<ul className="list-group">
				{codes.map(({ code, labelLg1 }) => {
					return (
						<li className="list-group-item" key={code}>
							{code} - {labelLg1}
						</li>
					);
				})}
			</ul>
		</SlidingPanel>
	);
};
