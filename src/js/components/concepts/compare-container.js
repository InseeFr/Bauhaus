import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import ConceptCompare from './compare';
import { saveSecondLang } from 'js/actions/app';
import loadGeneralAndAllNotes from 'js/actions/concepts/general-and-all-notes';
import { dictionary } from 'js/utils/dictionary';
import buildExtract from 'js/utils/build-extract';
import * as select from 'js/reducers';

const extractId = buildExtract('id');

class ConceptCompareContainer extends Component {
	componentWillMount() {
		const { id, general, notes } = this.props;
		if (!(general && notes)) {
			this.props.loadGeneralAndAllNotes(id);
		}
	}

	render() {
		let { id, general, notes, secondLang } = this.props;
		if (!(notes && general))
			return (
				<Loadable
					active={true}
					spinner
					text={dictionary.loadable.loading}
					color="#457DBB"
					background="grey"
					spinnerSize="400px"
				/>
			);
		return (
			<ConceptCompare
				id={id}
				conceptGeneral={general}
				conceptNotes={notes}
				secondLang={secondLang}
				saveSecondLang={this.props.saveSecondLang}
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
	//TODO create selector `getGeneralAndNotes`
	if (general) {
		notes = select.getAllNotes(state, id, general.conceptVersion);
	}
	return {
		id,
		secondLang: state.app.secondLang,
		general,
		notes,
	};
};

const mapDispatchToProps = {
	saveSecondLang,
	loadGeneralAndAllNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withRouter(ConceptCompareContainer)
);
