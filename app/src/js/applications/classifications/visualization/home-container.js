import React, { useState, useEffect, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassificationVisualization from './home';
import { Loading } from '@inseefr/wilco';
import * as mainSelect from 'js/reducers';
import { Stores, Auth } from 'bauhaus-utilities';
import api from 'js/remote-api/classifications-api';

const ClassificationVisualizationContainer = (props) => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const langs = useSelector((state) => mainSelect.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const [classification, setClassification] = useState([]);
	const permission = useSelector((state) => Auth.getPermission(state));
	const [publishing, setPublishing] = useState(false);
	const [serverSideError, setServerSideError] = useState();

	const getClassification = (id) => {
		Promise.all([
			api.getClassificationGeneral(id),
			api.getClassificationLevels(id),
		])
			.then(([general, levels]) => {
				setClassification({ general, levels });
			})
			.finally(() => setLoading(false));
	};

	const publish = useCallback(() => {
		setPublishing(true);
		api
			.publishClassification(classification.general)
			.then(() => {
				return getClassification(id);
			})
			.catch((error) => setServerSideError(error))
			.finally(() => setPublishing(false));
	}, [id, classification.general]);

	useEffect(() => {
		getClassification(id);
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	if (publishing) return <Loading text="publishing" />;

	if (!classification) return <Loading />;
	return (
		<ClassificationVisualization
			classification={classification}
			classificationId={id}
			secondLang={secondLang}
			langs={langs}
			permission={permission}
			publish={publish}
			serverSideError={serverSideError}
		/>
	);
};

export default ClassificationVisualizationContainer;

ClassificationVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
