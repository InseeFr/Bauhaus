import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import LevelVisualization from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadLevel from 'js/actions/classifications/level';
import * as select from 'js/reducers/classifications/level';
import { Stores } from 'bauhaus-utilities';

const extractClassificationId = buildExtract('classificationId');
const extractLevelId = buildExtract('levelId');

const LevelVisualizationContainer = ({ classificationId, levelId, level, loadLevel, secondLang }) => {

	const currentLevelId = level?.id;
	useEffect(() => {
		if (currentLevelId !== levelId) loadLevel(classificationId, levelId);
	}, [currentLevelId, classificationId, levelId, loadLevel])

	if (!level) return <Loading />;
	return <LevelVisualization level={level} secondLang={secondLang} />;
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const levelId = extractLevelId(ownProps);
	const level = select.getLevel(state, classificationId, levelId);
	const secondLang = Stores.SecondLang.getSecondLang(state);
	return {
		classificationId,
		levelId,
		level,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadLevel,
};

LevelVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			classificationId: PropTypes.string.isRequired,
			levelId: PropTypes.string.isRequired,
		}),
	}),
};
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LevelVisualizationContainer);
