import { useSelector, useDispatch } from 'react-redux';
import { getSecondLang, saveSecondLang } from '../../stores/second-lang';
import { CheckSecondLang } from '@inseefr/wilco';

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
