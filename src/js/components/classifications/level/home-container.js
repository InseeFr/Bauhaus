import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import LevelVisualization from './home';
import Loading from 'js/components/shared/loading';
import loadLevel from 'js/actions/classifications/level';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers/classifications/level';
import buildExtract from 'js/utils/build-extract';

const extractClassificationId = buildExtract('classificationId');
const extractLevelId = buildExtract('levelId');

class LevelVisualizationContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { classificationId, levelId, level } = this.props;
		if (!level) this.props.loadLevel(classificationId, levelId);
	}
	render() {
		const { level, secondLang } = this.props;
		if (!level) return <Loading textType="loading" context="classifications" />;
		return (
			<LevelVisualization
				level={level}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const classificationId = extractClassificationId(ownProps);
	const levelId = extractLevelId(ownProps);
	const level = select.getLevel(state, classificationId, levelId);
	const secondLang = state.app.secondLang;
	return {
		classificationId,
		levelId,
		level,
		secondLang,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadLevel,
};

LevelVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	LevelVisualizationContainer
);

LevelVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
			depth: PropTypes.string.isRequired,
		}),
	}),
};
export default LevelVisualizationContainer;
