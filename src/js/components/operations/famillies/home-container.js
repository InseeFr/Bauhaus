import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import FamilliesHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { famillies } from './fake-data';

class FamilliesHomeContainer extends Component {
	render() {
		if (!famillies) {
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
		return <FamilliesHome famillies={famillies} />;
	}
}

export default FamilliesHomeContainer;
