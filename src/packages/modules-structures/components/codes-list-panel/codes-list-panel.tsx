//@ts-nocheck
import { useState, useEffect } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import { CodeListApi } from '../../../sdk';
import './codes-list-panel.scss';
import { ActionToolbar } from '@inseefr/wilco';
import D from '../../i18n/build-dictionary';
import { sortArray } from '../../../utils/array-utils';
import { Code, CodesList } from '../../../model/CodesList';

const sortByLabel = sortArray('labelLg1');

type CodesListPanelTypes = {
	isOpen: boolean;
	handleBack: () => void;
	codesList?: CodesList;
};
export const CodesListPanel = ({
	isOpen,
	handleBack,
	codesList,
}: CodesListPanelTypes) => {
	const [codes, setCodes] = useState<Code[]>([]);
	const notation = codesList?.notation;

	useEffect(() => {
		if (notation && isOpen) {
			CodeListApi.getCodesListCodes(notation, 1, 0).then(
				(codes: { codes: Code[] }) => {
					setCodes(sortByLabel(codes?.codes || []));
				}
			);
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
