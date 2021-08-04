import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SortableTree from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

export default class RmesTree extends Component {
	constructor(props) {
		super(props);
		this.state = { treeData: props.treeData };
	}

	componentWillReceiveProps({ treeData }) {
		if (treeData !== this.props.treeData) this.setState({ treeData });
	}

	render() {
		const { treeData } = this.state;
		const { canDrag, linkPath } = this.props;

		return (
			<div style={{ width: '100%', height: '80vh' }}>
				<SortableTree
					treeData={treeData}
					onChange={(treeData) => this.setState({ treeData })}
					canDrag={canDrag || false}
					canDrop={() => false}
					generateNodeProps={(rowInfo) => ({
						buttons: [
							<Link to={linkPath(rowInfo.node.id)}>{rowInfo.node.label}</Link>,
						],
					})}
				/>
			</div>
		);
	}
}
