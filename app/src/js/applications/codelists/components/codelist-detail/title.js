import React from 'react';
import { CheckSecondLang, PageTitleBlock } from 'js/utils';

const ComponentTitle = ({ component, secondLang }) => {
	return (
		<React.Fragment>
			<PageTitleBlock
				titleLg1={component?.labelLg1}
				titleLg2={component?.labelLg2}
				secondLang={secondLang}
			/>
			<CheckSecondLang />
		</React.Fragment>
	);
};

export default ComponentTitle;
