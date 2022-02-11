import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import ClassificationVisualization from './home';
import { buildExtract, Loading } from '@inseefr/wilco';
import loadClassification from 'js/actions/classifications/classification';
import * as mainSelect from 'js/reducers';
import * as select from 'js/reducers/classifications/classification';
import { Stores } from 'bauhaus-utilities';

const extractId = buildExtract('id');

const ClassificationVisualizationContainer = (props) => {
	const { classification, id, secondLang, langs } = props;
	if (!classification) props.loadClassification(id);

	if (id !== props.id) {
		props.loadClassification(id);
	}

	if (!classification) return <Loading />;
	return (
		<ClassificationVisualization
			classification={classification}
			classificationId={id}
			secondLang={secondLang}
			langs={langs}
			loadClassification={loadClassification}
		/>
	);
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	const classification = select.getClassification(state, id);
	const secondLang = Stores.SecondLang.getSecondLang(state);
	const langs = mainSelect.getLangs(state);
	return {
		id,
		classification,
		secondLang,
		langs,
	};
};

const mapDispatchToProps = {
	loadClassification,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ClassificationVisualizationContainer);

ClassificationVisualizationContainer.propTypes = {
	match: PropTypes.shape({
		params: PropTypes.shape({
			id: PropTypes.string.isRequired,
		}),
	}),
};
