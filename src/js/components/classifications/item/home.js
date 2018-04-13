import React, { Component } from 'react';
import PageTitle from 'js/components/shared/page-title';
import PageSubtitle from 'js/components/shared/page-subtitle';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Narrowers from './narrowers';
import D from 'js/i18n';

class ItemVisualization extends Component {
	render() {
		const {
			item: { general, notes, narrowers },
			secondLang,
			langs,
		} = this.props;
		const { classificationId, itemId } = general;
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
				{secondLang &&
					general.prefLabelLg2 && (
						<PageSubtitle
							subTitle={general.prefLabelLg2}
							context="classifications"
						/>
					)}
				<Controls classificationId={classificationId} itemId={itemId} />
				<General
					general={general}
					classificationId={classificationId}
					secondLang={secondLang}
				/>
				{notes && <Notes secondLang={secondLang} notes={notes} langs={langs} />}
				{narrowers.length !== 0 && (
					<Narrowers
						narrowers={narrowers}
						classificationId={classificationId}
						secondLang={secondLang}
					/>
				)}
			</div>
		);
	}
}

export default ItemVisualization;
