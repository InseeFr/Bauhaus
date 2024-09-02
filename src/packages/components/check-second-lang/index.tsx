import { useDispatch } from 'react-redux';
import { CheckSecondLang as WilcoCheckSecondLang } from '@inseefr/wilco';
import { saveSecondLang, useSecondLang } from '../../redux/second-lang';

export const CheckSecondLang = () => {
	const secondLang = useSecondLang();
	const dispatch = useDispatch();
	return (
		<WilcoCheckSecondLang
			secondLang={secondLang}
			onChange={(e: any) => dispatch(saveSecondLang(e))}
		/>
	);
};
