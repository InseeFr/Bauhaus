import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { PageTitle } from 'bauhaus-library';
import Controls from './controls';
import Members from './members';

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
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				{members.length !== 0 && (
					<Members members={members} secondLang={secondLang} />
				)}
			</div>
		);
	}
}

export default FamilyVisualization;
