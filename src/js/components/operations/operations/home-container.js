import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import OperationsHome from './home';
import { operations } from './fake-data';

class OperationsHomeContainer extends Component {
	render() {
		if (!operations) return <Loading textType="loading" context="operations" />;
		return <OperationsHome operations={operations} />;
	}
}

export default OperationsHomeContainer;
