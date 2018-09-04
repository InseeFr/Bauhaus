import React, { Component } from 'react';
import { toggleOpen, isOpen } from 'js/components/operations/msd/msd/utils';
import { HashLink as Link } from 'react-router-hash-link';
import SectionItem from 'js/components/operations/msd/msd/section-item';

class SummaryItem extends Component {
	constructor(props) {
		super(props);
		this.state = { opened: isOpen(props.metadataStructure.idMas) };
	}

	expandOrCollapseItem() {
		this.setState({ opened: !this.state.opened });
		toggleOpen(this.props.metadataStructure.idMas);
	}

	render() {
		const { metadataStructure } = this.props;

		return (
			<li>
				<div className="primary-item">
					<Link
						to={`/operations/help/${metadataStructure.idMas}#${
							metadataStructure.idMas
						}`}
					>
						{metadataStructure.idMas} - {metadataStructure.masLabelLg1}
					</Link>
					<button
						className="up-down"
						title={metadataStructure.masLabelLg1}
						onClick={() => this.expandOrCollapseItem()}
					>
						{Object.keys(metadataStructure.children).length > 0 && (
							<span
								className={` glyphicon glyphicon-chevron-${
									this.state.opened ? 'up' : 'down'
								}`}
							/>
						)}
					</button>
				</div>

				{this.state.opened && (
					<SectionItem
						children={metadataStructure.children}
						parent={metadataStructure.idMas}
					/>
				)}
			</li>
		);
	}
}

export default SummaryItem;
