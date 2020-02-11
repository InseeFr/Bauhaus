import React, { Component } from 'react';
import { CheckSecondLang, PageSubtitle, PageTitle } from '@inseefr/ui';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Members from './members';

class SeriesVisualization extends Component {
	render() {
		const {
			series: { general, members },
			secondLang,
			langs,
		} = this.props;
		const notes = {
			scopeNoteLg1: general.scopeNoteLg1,
			scopeNoteLg2: general.scopeNoteLg2,
		};
		return (
			<div className="container">
				<PageTitle title={general.prefLabelLg1} />
				{general.prefLabelLg2 && (
					<PageSubtitle subtitle={general.prefLabelLg2} />
				)}
				<Controls />
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<General general={general} secondLang={secondLang} langs={langs} />
				{notes.scopeNoteLg1 && (
					<Notes notes={notes} secondLang={secondLang} langs={langs} />
				)}
				{members.length !== 0 && (
					<Members members={members} secondLang={secondLang} />
				)}
			</div>
		);
	}
}

export default SeriesVisualization;
