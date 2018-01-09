import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import StudyUnitsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { studyUnits } from './fake-data';

class StudyUnitsHomeContainer extends Component {
	render() {
		if (!studyUnits) {
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
		return <StudyUnitsHome studyUnits={studyUnits} />;
	}
}

export default StudyUnitsHomeContainer;
