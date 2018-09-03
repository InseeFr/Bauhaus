import React, { Component } from 'react';
import { toggleOpen, isOpen } from 'js/components/operations/msd/msd/utils';
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
					<button
						title={metadataStructure.masLabelLg1}
						onClick={() => this.expandOrCollapseItem()}
					>
						{metadataStructure.idMas} - {metadataStructure.masLabelLg1}
						<span
							className={`up-down glyphicon glyphicon-chevron-${
								this.state.opened ? 'up' : 'down'
							}`}
						/>
					</button>
				</div>
				{this.state.opened && (
					<SectionItem children={metadataStructure.children} />
				)}
			</li>
		);
	}
}

export default SummaryItem;
