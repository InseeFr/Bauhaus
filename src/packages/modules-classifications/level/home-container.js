import { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import LevelVisualization from './home';
import { Loading } from '../../components';
import loadLevel from '../../redux/actions/classifications/level';
import { getLevel } from '../../redux/classifications/level';
import { useParams } from 'react-router-dom';
import { useSecondLang } from '../../redux/second-lang';

const LevelVisualizationContainer = ({ loadLevel }) => {
	const { classificationId, levelId } = useParams();
	const level = useSelector((state) =>
		getLevel(state, classificationId, levelId)
	);
	const secondLang = useSecondLang();

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
