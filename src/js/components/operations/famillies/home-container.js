import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import FamilliesHome from './home';
import { famillies } from './fake-data';

class FamilliesHomeContainer extends Component {
	render() {
		if (!famillies) return <Loading textType="loading" context="operations" />;
		return <FamilliesHome famillies={famillies} />;
	}
}

export default FamilliesHomeContainer;
