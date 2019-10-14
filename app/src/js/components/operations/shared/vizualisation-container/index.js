import { Component } from 'react';

class VisualizationContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	publish(object, publishCall) {
		publishCall(object, err => {
			if (err) {
				this.setState({
					serverSideError: err,
				});
			}
		});
	}
}

export default VisualizationContainer;
