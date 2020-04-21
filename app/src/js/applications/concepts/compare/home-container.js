import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Loading, buildExtract } from '@inseefr/wilco';
import ConceptCompare from './home';
import loadConceptAndAllNotes from 'js/actions/concepts/concept-and-all-notes';
import * as select from 'js/reducers';
import { Stores } from 'bauhaus-utilities';

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
		if (!(notes && general)) return <Loading />;
		return (
			<ConceptCompare
				id={id}
				conceptGeneral={general}
				notes={notes}
				secondLang={secondLang}
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
		secondLang: Stores.SecondLang.getSecondLang(state),
		general,
		notes,
		langs,
	};
};

const mapDispatchToProps = {
	loadConceptAndAllNotes,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ConceptCompareContainer));
