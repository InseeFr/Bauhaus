import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';
import Controls from './controls';
import General from './general';
import Members from './members';

class LevelVisualization extends Component {
	render() {
		const { level: { general, members }, secondLang } = this.props;
		const { classificationId } = general;
		return (
			<div className="container">
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<PageTitle title={general.prefLabelLg1} context="classifications" />
				{general.prefLabelLg2 && (
					<PageSubtitle
						subtitle={general.prefLabelLg2}
						context="classifications"
					/>
				)}
				<Controls id={classificationId} />
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
