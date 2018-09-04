import React, { Component } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { toggleOpen, isOpen } from 'js/components/operations/msd/msd/utils';

class SectionItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			children: Object.keys(this.props.children).reduce((acc, childId) => {
				return {
					...acc,
					[childId]: {
						...this.props.children[childId],
						opened: isOpen(childId),
					},
				};
			}, {}),
		};
	}

	expandOrCollapseItem(id) {
		toggleOpen(id);
		this.setState({
			children: {
				...this.state.children,
				[id]: {
					...this.state.children[id],
					opened: !this.state.children[id].opened,
				},
			},
		});
	}
	render() {
		const { secondary, parent } = this.props;
		const { children } = this.state;
		if (Object.keys(children).length <= 0) return null;
		return (
			<ul className={secondary ? 'secondary sommaire-item' : 'sommaire-item'}>
				{Object.keys(children).map(id => {
					const child = children[id];
					return (
						<li key={child.idMas} className="help-item">
							{Object.keys(child.children).length > 0 && (
								<button
									className="white"
									title="expand/collapse"
									onClick={() => this.expandOrCollapseItem(id)}
								>
									<span
										className={`glyphicon glyphicon-chevron-${
											child.opened ? 'up' : 'down'
										}`}
									/>
								</button>
							)}
							<Link smooth to={`/operations/help/${parent}#${child.idMas}`}>
								{child.idMas} - {child.masLabelLg1}
							</Link>
							{child.opened && (
								<SectionItem
									children={child.children}
									secondary
									parent={parent}
								/>
							)}
						</li>
					);
				})}
			</ul>
		);
	}
}

export default SectionItem;
