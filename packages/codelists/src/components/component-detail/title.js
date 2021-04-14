import React from 'react';
import { CheckSecondLang, PageTitleBlock } from 'bauhaus-utilities';

const ComponentTitle = ({ component, secondLang }) => {
	return (
		<React.Fragment>
			<PageTitleBlock
				titleLg1={component?.codeListLabelLg1}
				titleLg2={component?.codeListLabelLg2}
				secondLang={secondLang}
			/>
			<CheckSecondLang />
		</React.Fragment>
	);
};

export default ComponentTitle;
