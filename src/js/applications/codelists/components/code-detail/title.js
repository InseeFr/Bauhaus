import { CheckSecondLang, PageTitleBlock } from 'js/utils';
const CodeTitle = ({ code, secondLang }) => {
	return (
		<>
			<PageTitleBlock
				titleLg1={code?.labelLg1}
				titleLg2={code?.labelLg2}
				secondLang={secondLang}
			/>
			<CheckSecondLang />
		</>
	);
};

export default CodeTitle;
