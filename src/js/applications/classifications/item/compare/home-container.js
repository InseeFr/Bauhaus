import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../../new-architecture/components';
import Compare from './home';
import useClassificationItem from '../hook';
import { getLocales } from '../../../../new-architecture/redux/selectors';
import { getSecondLang } from '../../../../new-architecture/redux/second-lang';

const CompareContainer = () => {
	const { classificationId, itemId } = useParams();

	const secondLang = useSelector((state) => getSecondLang(state));
	const langs = useSelector((state) => getLocales(state));

	const { isLoading, item } = useClassificationItem(classificationId, itemId);

	if (isLoading) return <Loading />;

	return (
		<Compare
			classificationId={classificationId}
			itemId={itemId}
			general={item.general}
			notes={item.notes}
			secondLang={secondLang}
			langs={langs}
		/>
	);
};

export default CompareContainer;
