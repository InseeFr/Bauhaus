import { useSelector, useDispatch } from 'react-redux';
import { CheckSecondLang as WilcoCheckSecondLang } from '@inseefr/wilco';
import { getSecondLang, saveSecondLang } from '../../redux/second-lang';

export const CheckSecondLang = () => {
	const secondLang = useSelector(getSecondLang);
	const dispatch = useDispatch();
	return (
		<WilcoCheckSecondLang
			secondLang={secondLang}
			onChange={(e: any) => dispatch(saveSecondLang(e))}
		/>
	);
};
