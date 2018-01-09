import React, { Component } from 'react';
import Loadable from 'react-loading-overlay';
import GroupsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { groups } from './fake-data';

class GroupsHomeContainer extends Component {
	render() {
		if (!groups) {
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
		return <GroupsHome groups={groups} />;
	}
}

export default GroupsHomeContainer;
