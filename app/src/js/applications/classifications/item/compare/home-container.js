import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Loading } from 'js/new-architecture/components/loading/loading';
import Compare from './home';
import * as mainSelect from 'js/reducers';
import { Stores } from 'js/utils';
import useClassificationItem from '../hook';

const CompareContainer = () => {
	const { classificationId, itemId } = useParams();

	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const langs = useSelector((state) => mainSelect.getLangs(state));

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
