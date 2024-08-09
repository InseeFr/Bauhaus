import { CheckSecondLang } from '../../../../utils';
import { PageTitleBlock } from '../../../../new-architecture/components';
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
