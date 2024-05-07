import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import LevelVisualization from './home';
import { Loading } from '@inseefr/wilco';
import loadLevel from 'js/actions/classifications/level';
import * as select from 'js/reducers/classifications/level';
import { Stores } from 'bauhaus-utilities';
import { useParams } from 'react-router-dom';

const LevelVisualizationContainer = ({ loadLevel }) => {
	const { classificationId, levelId } = useParams();
	const level = useSelector((state) =>
		select.getLevel(state, classificationId, levelId)
	);
	const secondLang = useSelector((state) =>
		Stores.SecondLang.getSecondLang(state)
	);

	const currentLevelId = level?.id;
	useEffect(() => {
		if (currentLevelId !== levelId) loadLevel(classificationId, levelId);
	}, [currentLevelId, classificationId, levelId, loadLevel]);

	if (!level) return <Loading />;
	return <LevelVisualization level={level} secondLang={secondLang} />;
};

const mapDispatchToProps = {
	loadLevel,
};

export default connect(
	undefined,
	mapDispatchToProps
)(LevelVisualizationContainer);
