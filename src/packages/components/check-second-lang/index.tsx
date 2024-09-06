import { CheckSecondLang as WilcoCheckSecondLang } from '@inseefr/wilco';
import { useSecondLang } from '../../utils/hooks/second-lang';

export const CheckSecondLang = () => {
	const [secondLang, toggleSecondLang] = useSecondLang();
	return (
		<WilcoCheckSecondLang
			secondLang={secondLang}
			onChange={() => toggleSecondLang()}
		/>
	);
};
