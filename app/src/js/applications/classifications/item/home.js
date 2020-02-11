import React, { Component } from 'react';
import { CheckSecondLang, PageTitle, PageSubtitle } from '@inseefr/ui';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Narrowers from './narrowers';

class ItemVisualization extends Component {
	render() {
		const {
			item: { general, notes, narrowers },
			secondLang,
			langs,
		} = this.props;
		const { classificationId, itemId, conceptVersion: version } = general;
		return (
			<div className="container">
				<PageTitle title={general.prefLabelLg1} />
				{secondLang && general.prefLabelLg2 && (
					<PageSubtitle subTitle={general.prefLabelLg2} />
				)}
				<Controls
					classificationId={classificationId}
					itemId={itemId}
					version={version}
				/>
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
				<General
					general={general}
					classificationId={classificationId}
					itemId={itemId}
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
