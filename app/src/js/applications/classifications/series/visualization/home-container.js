import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import SeriesVisualization from './home';
import { Loading } from '@inseefr/wilco';
import loadSeries from 'js/actions/classifications/series/series';
import { saveSecondLang } from 'js/actions/app';
import * as mainSelect from 'js/reducers';
import * as select from 'js/reducers/classifications/series';
import buildExtract from '@inseefr/wilco/src/utils/build-extract';
import { getSecondLang } from 'js/reducers/app';

const extractId = buildExtract('id');

class SeriesVisualizationContainer extends Component {
	constructor(props) {
		super();
	}
	componentWillMount() {
		const { series, id } = this.props;
		if (!series) this.props.loadSeries(id);
	}
	render() {
		const { series, secondLang, langs } = this.props;
		if (!series) return <Loading />;
		return (
			<SeriesVisualization
				series={series}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
				langs={langs}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const series = select.getSeries(state, id);
	const secondLang = getSecondLang(state);
	const langs = mainSelect.getLangs(state);
	return {
		id,
		series,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadSeries,
};

SeriesVisualizationContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SeriesVisualizationContainer);

SeriesVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
export default SeriesVisualizationContainer;
