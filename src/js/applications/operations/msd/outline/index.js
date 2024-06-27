import { useState } from 'react';
import { toggleOpen, isOpen } from 'js/applications/operations/msd/utils';
import OutlineBlock from 'js/applications/operations/msd/outline/outline-block';
import D from 'js/i18n';

import './style.scss';
import { OutlineButtonWithScroll } from './outline-button-with-scroll';

const Outline = ({
	storeCollapseState,
	metadataStructure,
	baseUrl = '/operations/help/',
	disableSectionAnchor,
}) => {
	const [opened, setOpened] = useState(
		storeCollapseState && isOpen(metadataStructure.idMas)
	);

	const expandOrCollapseItem = () => {
		setOpened(!opened);
		storeCollapseState && toggleOpen(metadataStructure.idMas);
	};

	return (
		<li>
			<div className="msd__outline-primary-item">
				<OutlineButtonWithScroll
					id={metadataStructure.idMas}
					baseUrl={`${baseUrl}${
						disableSectionAnchor ? '' : metadataStructure.idMas
					}`}
				>
					{metadataStructure.idMas} -{' '}
					{metadataStructure.masLabelBasedOnCurrentLang}
				</OutlineButtonWithScroll>

				{Object.keys(metadataStructure.children).length > 0 && (
					<button
						className="msd__outline-primary-updown"
						title={opened ? D.hide : D.display}
						onClick={expandOrCollapseItem}
					>
						<span
							className={` glyphicon glyphicon-chevron-${
								opened ? 'up' : 'down'
							}`}
						/>
					</button>
				)}
			</div>

			{opened && (
				<OutlineBlock
					children={metadataStructure.children}
					parent={metadataStructure.idMas}
					storeCollapseState={storeCollapseState}
					baseUrl={baseUrl}
					disableSectionAnchor={disableSectionAnchor}
				/>
			)}
		</li>
	);
};

export default Outline;
