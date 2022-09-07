import React  from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassificationVisualization from './home';
import { Loading } from '@inseefr/wilco';
import * as mainSelect from 'js/reducers';
import { Stores, Auth } from 'bauhaus-utilities';
import { useClassification, usePublishClassification } from '../hooks';

const ClassificationVisualizationContainer = () => {

	const { id } = useParams();
	const langs = useSelector((state) => mainSelect.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const permission = useSelector((state) => Auth.getPermission(state));

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

