import React, { Component } from 'react';
import { PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import Members from './members';
import { CheckSecondLang } from 'bauhaus-utilities';

class FamilyVisualization extends Component {
	render() {
		const {
			family: {
				general: { prefLabelLg1 },
				members,
			},
			secondLang,
		} = this.props;
		return (
			<div className="container">
				<PageTitle title={prefLabelLg1} context="classifications" />
				<Controls />
				<CheckSecondLang />
				{members.length !== 0 && (
					<Members members={members} secondLang={secondLang} />
				)}
			</div>
		);
	}
}

export default FamilyVisualization;
