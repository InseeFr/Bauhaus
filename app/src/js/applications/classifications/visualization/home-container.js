import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ClassificationVisualization from './home';
import { Loading } from '@inseefr/wilco';
import loadClassification from 'js/actions/classifications/classification';
import * as select from 'js/reducers/classifications/classification';
import { Stores, Auth } from 'bauhaus-utilities';
import api from 'js/remote-api/classifications-api';

const ClassificationVisualizationContainer = (props) => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const langs = useSelector((state) => select.getLangs(state));
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);
	const [classification, setClassification] = useState([]);
	const permission = useSelector((state) => Auth.getPermission(state));

	useEffect(() => {
		api
			.getClassification(id)
			.then((classification) => setClassification(classification))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return <Loading />;
	}

	if (!classification) return <Loading />;
	return (
		<ClassificationVisualization
			classification={classification}
			classificationId={id}
			secondLang={secondLang}
			langs={langs}
			loadClassification={loadClassification}
			permission={permission}
		/>
	);
};

ClassificationVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
