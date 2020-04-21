import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import FamilyVisualization from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadFamily from 'js/actions/classifications/families/family';
import * as select from 'js/reducers/classifications/family';
import { Stores } from 'bauhaus-utilities';

const extractId = buildExtract('id');

class FamilyVisualizationContainer extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string.isRequired,
			}),
		}),
	};

	constructor(props) {
		super();
	}
	componentWillMount() {
		const { family, id } = this.props;
		if (!family) this.props.loadFamily(id);
	}
	render() {
		const { family, secondLang } = this.props;
		if (!family) return <Loading />;
		return <FamilyVisualization family={family} secondLang={secondLang} />;
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const family = select.getFamily(state, id);
	const secondLang = Stores.SecondLang.getSecondLang(state);
	return {
		id,
		family,
		secondLang,
	};
};

const mapDispatchToProps = {
	loadFamily,
};

FamilyVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FamilyVisualizationContainer);

export default FamilyVisualizationContainer;
