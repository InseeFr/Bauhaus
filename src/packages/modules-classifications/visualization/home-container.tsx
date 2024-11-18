import { useParams } from 'react-router-dom';
import ClassificationVisualization from './home';
import { Loading } from '@components/loading';
import { useClassification, usePublishClassification } from '../hooks';
import { useSecondLang } from '../../utils/hooks/second-lang';

export const Component = () => {
	const { id } = useParams<{ id: string }>();
	const [secondLang] = useSecondLang();

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
			publish={publish}
			serverSideError={error}
		/>
	);
};
