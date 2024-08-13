import { useSelector, useDispatch } from 'react-redux';
import { CheckSecondLang } from '@inseefr/wilco';
import {
	getSecondLang,
	saveSecondLang,
} from '../../../new-architecture/redux/second-lang';

const CheckSecondLangContainer = () => {
	const secondLang = useSelector(getSecondLang);
	const dispatch = useDispatch();
	return (
		<CheckSecondLang
			secondLang={secondLang}
			onChange={(e) => dispatch(saveSecondLang(e))}
		/>
	);
};

export default CheckSecondLangContainer;
