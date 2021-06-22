import React from 'react';
import { PageTitle, PageSubtitle } from '@inseefr/wilco';
import Controls from './controls';
import General from './general';
import Notes from './notes';
import Narrowers from './narrowers';
import { CheckSecondLang } from 'bauhaus-utilities';

const ItemVisualization = ({
	item: { general, notes, narrowers },
	secondLang,
	langs,
}) => {
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
			<CheckSecondLang />
			<General
				general={general}
				classificationId={classificationId}
				itemId={itemId}
				secondLang={secondLang}
				langs={langs}
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
};

export default ItemVisualization;
