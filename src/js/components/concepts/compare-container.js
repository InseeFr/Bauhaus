import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ConceptCompare from './compare';
import loadGeneralAndAllNotes from 'js/actions/concepts/general-and-all-notes';
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
    let { id, general, notes } = this.props;
    if (!(notes && general)) return <div>Loading</div>;
    return (
      <ConceptCompare id={id} conceptGeneral={general} conceptNotes={notes} />
    );
  }
}

ConceptCompareContainer.propTypes = {
  id: PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const id = extractId(ownProps);
  let notes;
  const general = select.getGeneral(state, id);
  //TODO create selector `getGeneralAndNotes`
  if (general) {
    notes = select.getAllNotes(state, id, general.conceptVersion);
  }
  return {
    id,
    general,
    notes,
  };
};

const mapDispatchToProps = {
  loadGeneralAndAllNotes,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ConceptCompareContainer)
);
