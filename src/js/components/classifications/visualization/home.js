import React, { Component } from 'react';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Levels from './levels';

class ClassificationVisualization extends Component {
	render() {
		const {
			classification: { general, levels },
			secondLang,
			langs,
		} = this.props;
		const notes = {
			scopeNoteLg1: general.scopeNoteLg1,
			scopeNoteLg2: general.scopeNoteLg2,
			changeNoteLg1: general.changeNoteLg1,
			changeNoteLg2: general.changeNoteLg2,
			descriptionLg1: general.descriptionLg1,
			descriptionLg2: general.descriptionLg2,
		};
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
				<Controls />
				<General general={general} secondLang={secondLang} langs={langs} />
				{notes.scopeNoteLg1 && (
					<Notes notes={notes} secondLang={secondLang} langs={langs} />
				)}
				{levels.length !== 0 && (
					<Levels
						levels={levels}
						classificationId={general.id}
						secondLang={secondLang}
					/>
				)}
			</div>
		);
	}
}

export default ClassificationVisualization;
