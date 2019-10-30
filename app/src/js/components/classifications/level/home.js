import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import { PageTitle, PageSubtitle } from 'bauhaus-library';
import Controls from './controls';
import General from './general';
import Members from './members';

class LevelVisualization extends Component {
	render() {
		const {
			level: { general, members },
			secondLang,
		} = this.props;
		const { classificationId } = general;
		return (
			<div className="container">
				<PageTitle title={general.prefLabelLg1} context="classifications" />
				{general.prefLabelLg2 && (
					<PageSubtitle
						subtitle={general.prefLabelLg2}
						context="classifications"
					/>
				)}
				<Controls id={classificationId} />
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<General
					general={general}
					classificationId={classificationId}
					secondLang={secondLang}
				/>
				{members.length !== 0 && (
					<Members
						members={members}
						classificationId={classificationId}
						secondLang={secondLang}
					/>
				)}
			</div>
		);
	}
}

export default LevelVisualization;
