import React, { Component } from 'react';
import { Tree } from 'react-d3-tree';

class RmesTree extends Component {
	state = {};
	componentDidMount() {
		const { orientation } = this.props;
		const dimensions = this.treeContainer.getBoundingClientRect();
		this.setState({
			translate: {
				x: dimensions.width / (orientation === 'vertical' ? 2 : 10),
				y: dimensions.height / (orientation === 'vertical' ? 10 : 2),
			},
		});
	}
	render() {
		const { data, orientation, initialDepth } = this.props;
		const { translate } = this.state;
		if (data)
			return (
				<div
					style={{ width: '100%', height: '100vh' }}
					ref={(tc) => (this.treeContainer = tc)}
				>
					<Tree
						data={data}
						translate={translate}
						orientation={orientation}
						initialDepth={initialDepth}
					/>
				</div>
			);
		return <div>Wait</div>;
	}
}

export default RmesTree;
