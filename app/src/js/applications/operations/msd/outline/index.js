import React, { useState } from 'react';
import { toggleOpen, isOpen } from 'js/applications/operations/msd/utils';
import { HashLink as Link } from 'react-router-hash-link';
import OutlineBlock from 'js/applications/operations/msd/outline/outline-block';
import PropTypes from 'prop-types';
import D from 'js/i18n';

import './style.scss';

const Outline = ({ storeCollapseState, metadataStructure, baseUrl = '/operations/help/', disableSectionAnchor }) => {
	const [opened, setOpened] = useState(storeCollapseState && isOpen(metadataStructure.idMas));

	const expandOrCollapseItem = () => {
		setOpened(!opened)
		storeCollapseState && toggleOpen(metadataStructure.idMas);
	};

	return (
		<li>
			<div className="msd__outline-primary-item">
				<Link
					to={`${baseUrl}${
						disableSectionAnchor ? '' : metadataStructure.idMas
					}#${metadataStructure.idMas}`}
				>
					{metadataStructure.idMas} -{' '}
					{metadataStructure.masLabelBasedOnCurrentLang}
				</Link>

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
}

Outline.propTypes = {
	storeCollapseState: PropTypes.bool,
	metadataStructure: PropTypes.object.isRequired,
	baseUrl: PropTypes.string,
	disableSectionAnchor: PropTypes.bool
};

export default Outline;
