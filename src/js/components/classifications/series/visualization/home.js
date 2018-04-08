import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Members from './members';
import D from 'js/i18n';

class SeriesVisualization extends Component {
	render() {
		const { series: { general, members }, secondLang, langs } = this.props;
		const notes = {
			scopeNoteLg1: general.scopeNoteLg1,
			scopeNoteLg2: general.scopeNoteLg2,
		};
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<label className="pull-right">
							<input
								type="checkbox"
								checked={secondLang}
								onChange={this.props.saveSecondLang}
							/>{' '}
							{D.displayLg2}
						</label>
					</div>
				</div>
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
				{members.length !== 0 && (
					<Members members={members} secondLang={secondLang} />
				)}
			</div>
		);
	}
}

export default SeriesVisualization;
