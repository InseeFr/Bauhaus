import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import FamilyVisualization from './home';
import Loading from 'js/components/shared/loading';
import loadFamily from 'js/actions/classifications/families/family';
import { saveSecondLang } from 'js/actions/app';
import * as select from 'js/reducers/classifications/family';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class FamilyVisualizationContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { family, id } = this.props;
		if (!family) this.props.loadFamily(id);
	}
	render() {
		const { family, secondLang } = this.props;
		if (!family)
			return <Loading textType="loading" context="classifications" />;
		return (
			<FamilyVisualization
				family={family}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const family = select.getFamily(state, id);
	const secondLang = state.app.secondLang;
	return {
		id,
		family,
		secondLang,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadFamily,
};

FamilyVisualizationContainer = connect(mapStateToProps, mapDispatchToProps)(
	FamilyVisualizationContainer
);

FamilyVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default FamilyVisualizationContainer;
