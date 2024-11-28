//@ts-nocheck
import { ActionToolbar } from '@components/action-toolbar';
import { RightSlidingPanel } from '@components/sliding-panel';

import { useAllCodes } from '@utils/hooks/codeslist';

import { CodesList } from '../../../model/CodesList';
import D from '../../i18n/build-dictionary';
import './codes-list-panel.scss';

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
	const { data: codes } = useAllCodes(codesList?.notation, isOpen);

	if (!codes) {
		return null;
	}

	return (
		<RightSlidingPanel
			panelClassName="codes-list-panel"
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
		</RightSlidingPanel>
	);
};
