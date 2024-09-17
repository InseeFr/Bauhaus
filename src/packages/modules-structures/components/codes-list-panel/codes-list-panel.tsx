//@ts-nocheck
import SlidingPanel from 'react-sliding-side-panel';
import './codes-list-panel.scss';
import D from '../../i18n/build-dictionary';
import { CodesList } from '../../../model/CodesList';
import { useAllCodes } from '../../../utils/hooks/codeslist';
import { ActionToolbar } from '../../../components/action-toolbar';

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
		<SlidingPanel
			panelClassName="codes-list-panel"
			type="right"
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
