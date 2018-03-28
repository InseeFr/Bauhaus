import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import FamiliesHome from './home';
import { families } from './fake-data';

class FamiliesHomeContainer extends Component {
	render() {
		if (!families) return <Loading textType="loading" context="operations" />;
		return <FamiliesHome families={families} />;
	}
}

export default FamiliesHomeContainer;
