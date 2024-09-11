import { Component } from 'react';

class VisualizationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		if (!this.props.object.id) {
			this.props.load(this.props.id);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.id !== nextProps.id) {
			this.props.load(nextProps.id);
		}
	}

	publish(object, publishCall) {
		publishCall(object, err => {
			if (err) {
				this.setState({
					serverSideError: err,
				});
			} else {
				this.props.load(object.id);
			}
		});
	}
}

export default VisualizationContainer;
