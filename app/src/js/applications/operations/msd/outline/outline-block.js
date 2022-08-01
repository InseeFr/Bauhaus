import React, { useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { toggleOpen, isOpen } from 'js/applications/operations/msd/utils';
import PropTypes from 'prop-types';
import D from 'js/i18n';

export const OutlineBlock = ({ secondary, parent, baseUrl, disableSectionAnchor = false, children }) => {
	const [childrenDictionary, setChildrenDictionary] = useState(Object.keys(children).reduce((acc, childId) => {
		return {
			...acc,
			[childId]: {
				...children[childId],
				opened: isOpen(childId),
			},
		};
	}, {}));

	const expandOrCollapseItem = ({ currentTarget: { id } }) => {
		toggleOpen(id);
		setChildrenDictionary({
			...childrenDictionary,
			[id]: {
				...childrenDictionary[id],
				opened: !childrenDictionary[id].opened,
			}
		})
	};

	if (Object.keys(childrenDictionary).length <= 0) return null;

	const childrenArray = Object.values(childrenDictionary);

	return (
		<ul className={secondary ? 'msd__item-secondary' : 'msd__item'}>
			{childrenArray.map((child) => {
				return (
					<li key={child.idMas} className="help-item">
						{Object.keys(child.children).length > 0 && (
							<button
								className="msd__item-updown"
								title={child.opened ? D.hide : D.display}
								id={child.idMas}
								onClick={expandOrCollapseItem}
							>
									<span
										className={`glyphicon glyphicon-chevron-${
											child.opened ? 'up' : 'down'
										}`}
									/>
							</button>
						)}
						<Link
							smooth
							to={`${baseUrl}${disableSectionAnchor ? '' : parent}#${
								child.idMas
							}`}
						>
							{child.idMas} - {child.masLabelBasedOnCurrentLang}
						</Link>
						{child.opened && (
							<OutlineBlock
								children={child.children}
								secondary
								parent={parent}
								baseUrl={baseUrl}
								disableSectionAnchor={disableSectionAnchor}
							/>
						)}
					</li>
				);
			})}
		</ul>
	);
}

OutlineBlock.propTypes = {
	secondary: PropTypes.bool,
	parent: PropTypes.string,
	baseUrl: PropTypes.string,
	disableSectionAnchor: PropTypes.bool,
	children: PropTypes.object
};

export default OutlineBlock;
