import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassificationVisualization from './home';
import { Loading } from '../../components';
import { useClassification, usePublishClassification } from '../hooks';
import { getLocales, getPermission } from '../../redux/selectors';
import { getSecondLang } from '../../redux/second-lang';

const ClassificationVisualizationContainer = () => {
	const { id } = useParams();
	const langs = useSelector((state) => getLocales(state));
	const secondLang = useSelector((state) => getSecondLang(state));
	const permission = useSelector((state) => getPermission(state));

	const { isLoading, classification } = useClassification(id);
	const { isPublishing, publish, error } = usePublishClassification();

	if (isLoading) {
		return <Loading />;
	}

	if (isPublishing) return <Loading text="publishing" />;

	if (!classification) return <Loading />;
	return (
		<ClassificationVisualization
			classification={classification}
			classificationId={id}
			secondLang={secondLang}
			langs={langs}
			permission={permission}
			publish={() => publish(id)}
			serverSideError={error}
		/>
	);
};

export default ClassificationVisualizationContainer;