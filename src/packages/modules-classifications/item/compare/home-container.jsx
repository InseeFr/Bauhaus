import { useParams } from 'react-router-dom';
import { Loading } from '@components/loading';
import Compare from './home';
import useClassificationItem from '../hook';
import { useSecondLang } from '../../../utils/hooks/second-lang';

export const Component = () => {
	const { classificationId, itemId } = useParams();

	const [secondLang] = useSecondLang();

	const { isLoading, item } = useClassificationItem(classificationId, itemId);

	if (isLoading) return <Loading />;

	return (
		<Compare
			classificationId={classificationId}
			itemId={itemId}
			general={item.general}
			notes={item.notes}
			secondLang={secondLang}
		/>
	);
};
