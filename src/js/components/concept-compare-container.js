import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ConceptCompare from './concept-compare';
import { loadConceptGeneral, loadConceptNotes } from '../actions/concept';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

class ConceptCompareContainer extends Component {
	componentWillMount() {
		const { conceptGeneral } = this.props;
		const id = extractId(this.props);
		if (!conceptGeneral) {
			this.props.loadConceptGeneral(id);
		}
		this.loadNotes(this.props);
	}

	loadNotes(props) {
		const { conceptGeneral, conceptNotes } = props;
		if (!conceptGeneral) return;
		const id = extractId(props);
		const { conceptVersion: version } = conceptGeneral;
		Array(Number(version)).fill().forEach((_, i) => {
			if (!conceptNotes || !conceptNotes[i + 1]) {
				props.loadConceptNotes(id, i + 1);
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		this.loadNotes(nextProps);
	}

	render() {
		let { conceptGeneral, conceptNotes } = this.props;
		if (!conceptNotes || !conceptGeneral) return <div>Loading</div>;
		let allNotesNotLoaded = false;
		const notes = Object.keys(conceptNotes).reduce((notes, version) => {
			const results = conceptNotes[version].results;
			if (!results) {
				allNotesNotLoaded = true;
			} else notes[version] = results;
			return notes;
		}, {});

		if (allNotesNotLoaded) return <div>Loading</div>;
		return (
			<ConceptCompare conceptGeneral={conceptGeneral} conceptNotes={notes} />
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	let conceptGeneral;
	const id = extractId(ownProps);
	const generalResource = state.conceptGeneral[id];
	if (generalResource && generalResource.results) {
		conceptGeneral = generalResource.results;
	}
	const conceptNotes = state.conceptNotes[id];

	return { conceptGeneral, conceptNotes };
};

const mapDispatchToProps = {
	loadConceptGeneral,
	loadConceptNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withRouter(ConceptCompareContainer)
);
