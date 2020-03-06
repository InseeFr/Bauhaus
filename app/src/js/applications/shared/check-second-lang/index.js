import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveSecondLang } from 'js/actions/app';
import { getSecondLang } from 'js/reducers/app';

import { CheckSecondLang } from '@inseefr/wilco';

export default () => {
	const secondLang = useSelector(state => getSecondLang(state));
	const dispatch = useDispatch();
	return (
		<CheckSecondLang
			secondLang={secondLang}
			onChange={e => dispatch(saveSecondLang(e))}
		/>
	);
};
