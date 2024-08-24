import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassificationVisualization from './home';
import { Loading } from '../../components';
import { useClassification, usePublishClassification } from '../hooks';
import { getLocales } from '../../redux/selectors';
import { getSecondLang } from '../../redux/second-lang';
import { ReduxModel } from '../../redux/model';

const ClassificationVisualizationContainer = () => {
	const { id } = useParams<{ id: string }>();
	const langs = useSelector((state: ReduxModel) => getLocales(state));
	const secondLang = useSelector((state: ReduxModel) => getSecondLang(state));

	const { isLoading, classification } = useClassification(id);
	const { isPublishing, publish, error } = usePublishClassification(id);

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
			publish={publish}
			serverSideError={error}
		/>
	);
};

export default ClassificationVisualizationContainer;
