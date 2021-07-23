import React from 'react';
import { CheckSecondLang, PageTitleBlock } from 'bauhaus-utilities';

const CodeTitle = ({ code, secondLang }) => {
	return (
		<React.Fragment>
			<PageTitleBlock
				titleLg1={code?.labelLg1}
				titleLg2={code?.labelLg2}
				secondLang={secondLang}
			/>
			<CheckSecondLang />
		</React.Fragment>
	);
};

export default CodeTitle;
