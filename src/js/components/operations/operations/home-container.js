import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import OperationsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { operations } from './fake-data';

class OperationsHomeContainer extends Component {
	render() {
		if (!operations) {
			return (
				<div>
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.loading}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);
		}
		return <OperationsHome operations={operations} />;
	}
}

export default OperationsHomeContainer;
