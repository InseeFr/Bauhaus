import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import SubGroupsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { subGroups } from './fake-data';

class SubGroupsHomeContainer extends Component {
	render() {
		if (!subGroups) {
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
		return <SubGroupsHome subGroups={subGroups} />;
	}
}

export default SubGroupsHomeContainer;
