import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loading from 'js/components/shared/loading';
import ConceptCompare from './home';
import { saveSecondLang } from 'js/actions/app';
import loadConceptAndAllNotes from 'js/actions/concepts/concept-and-all-notes';
import buildExtract from 'js/utils/build-extract';
import * as select from 'js/reducers';

const extractId = buildExtract('id');

class ConceptCompareContainer extends Component {
	componentWillMount() {
		const { id, general, notes } = this.props;
		if (!(general && notes)) {
			this.props.loadConceptAndAllNotes(id);
		}
	}

	render() {
		let { id, general, notes, secondLang, langs } = this.props;
		if (!(notes && general))
			return <Loading textType="loading" context="concepts" />;
		return (
			<ConceptCompare
				id={id}
				conceptGeneral={general}
				notes={notes}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
				langs={langs}
			/>
		);
	}
}

ConceptCompareContainer.propTypes = {
	id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	let notes;
	const general = select.getConceptGeneral(state, id);
	const langs = select.getLangs(state);
	if (general) {
		notes = select.getAllNotes(state, id, general.conceptVersion);
	}
	return {
		id,
		secondLang: state.app.secondLang,
		general,
		notes,
		langs,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadConceptAndAllNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withRouter(ConceptCompareContainer)
);
