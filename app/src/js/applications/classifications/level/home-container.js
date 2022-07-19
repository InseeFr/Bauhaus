import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import LevelVisualization from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadLevel from 'js/actions/classifications/level';
import * as select from 'js/reducers/classifications/level';
import { Stores } from 'bauhaus-utilities';

const extractClassificationId = buildExtract('classificationId');
const extractLevelId = buildExtract('levelId');

class LevelVisualizationContainer extends Component {
	componentWillMount() {
		const { classificationId, levelId, level } = this.props;
		if (!level) this.props.loadLevel(classificationId, levelId);
	}
	componentWillReceiveProps({ levelId }) {
		if (levelId !== this.props.levelId) {
			this.props.loadLevel(this.props.classificationId, levelId);
		}
	}
	render() {
		const { level, secondLang } = this.props;
		if (!level) return <Loading />;
		return <LevelVisualization level={level} secondLang={secondLang} />;
	}
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

LevelVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(LevelVisualizationContainer);

LevelVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			classificationId: PropTypes.string.isRequired,
			levelId: PropTypes.string.isRequired,
		}),
	}),
};
export default LevelVisualizationContainer;
