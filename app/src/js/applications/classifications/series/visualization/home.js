import React from 'react';
import { PageSubtitle, PageTitle } from '@inseefr/wilco';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Members from './members';
import { CheckSecondLang, useTitle } from 'js/utils';
import D from '../../../../i18n/build-dictionary';

const SeriesVisualization = ({
	series: { general, members },
	secondLang,
	langs,
}) => {
	useTitle(
		D.seriesTitle + ' - ' + D.classificationsTitle,
		general?.prefLabelLg1
	);

	const notes = {
		scopeNoteLg1: general.scopeNoteLg1,
		scopeNoteLg2: general.scopeNoteLg2,
	};
	return (
		<div className="container">
			<PageTitle title={general.prefLabelLg1} />
			{general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
			<Controls />
			<CheckSecondLang />
			<General general={general} secondLang={secondLang} langs={langs} />
			{notes.scopeNoteLg1 && (
				<Notes notes={notes} secondLang={secondLang} langs={langs} />
			)}
			{members.length !== 0 && (
				<Members members={members} secondLang={secondLang} />
			)}
		</div>
	);
};

export default SeriesVisualization;
