import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CheckSecondLang from 'js/components/shared/second-lang-checkbox';
import PageTitle from 'js/components/shared/page-title';
import { PageSubtitle } from 'bauhaus-library';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Levels from './levels';
import D from 'js/i18n';

class ClassificationVisualization extends Component {
	render() {
		const {
			classification: { general, levels },
			classificationId,
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
				<PageTitle title={general.prefLabelLg1} context="classifications" />
				{general.prefLabelLg2 && (
					<PageSubtitle
						subtitle={general.prefLabelLg2}
						context="classifications"
					/>
				)}
				<div className="row">
					<div className="col-md-12 centered">
						<Link
							to={`/classifications/classification/${classificationId}/items`}
						>
							<h3 className="glyphicon glyphicon-zoom-in inline"> </h3>
							<h3 className="inline">{D.classificationAllItemsTitle}</h3>
						</Link>
					</div>
				</div>
				<Controls />
				<CheckSecondLang
					secondLang={secondLang}
					onChange={this.props.saveSecondLang}
				/>
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
