import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import LevelVisualization from './home';
import { Loading } from '../../../new-architecture/components';
import loadLevel from '../../../actions/classifications/level';
import { getLevel } from '../../../new-architecture/redux/classifications/level';
import { Stores } from '../../../utils';
import { useParams } from 'react-router-dom';

const LevelVisualizationContainer = ({ loadLevel }) => {
	const { classificationId, levelId } = useParams();
	const level = useSelector((state) =>
		getLevel(state, classificationId, levelId)
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
