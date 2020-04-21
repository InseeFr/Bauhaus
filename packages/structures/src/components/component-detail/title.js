import React from 'react';
import { PageTitle, PageSubtitle } from '@inseefr/wilco';
import { CheckSecondLang } from 'bauhaus-utilities';

const ComponentTitle = ({ component, secondLang }) => {
	return (
		<React.Fragment>
			<PageTitle title={component?.labelLg1} />
			{secondLang && component?.labelLg2 && (
				<PageSubtitle subTitle={component?.labelLg2} />
			)}
			<CheckSecondLang />
		</React.Fragment>
	);
};

export default ComponentTitle;
