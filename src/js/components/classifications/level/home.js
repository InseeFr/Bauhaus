import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';
import Controls from './controls';
import General from './general';
import Members from './members';
import D from 'js/i18n';

class LevelVisualization extends Component {
	render() {
		const { level: { general, members }, secondLang } = this.props;
		const { classificationId } = general;
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
