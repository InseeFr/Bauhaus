import { CheckSecondLang } from '@components/check-second-lang';
import { PageTitleBlock } from '@components/page-title-block';

const ComponentTitle = ({ component, secondLang }) => {
	return (
		<>
			<PageTitleBlock
				titleLg1={component?.labelLg1}
				titleLg2={component?.labelLg2}
				secondLang={secondLang}
			/>

			<CheckSecondLang />
		</>
	);
};

export default ComponentTitle;
