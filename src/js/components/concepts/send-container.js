import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import loadGeneral from 'js/actions/concepts/general';
import sendConcept from 'js/actions/concepts/send';
import * as select from 'js/reducers';
import buildExtract from 'js/utils/build-extract';

import ConceptSend from './send';

const extractId = buildExtract('id');

class ConceptSendContainer extends Component {
  componentWillMount() {
    //TODO create a `resetSend` action to reset the status in remote calls
    //when we load the component
    const { id, loaded, loadGeneral } = this.props;
    if (!loaded) loadGeneral(id);
  }

  render() {
    const {
      id,
      prefLabelLg1,
      isValidated,
      loaded,
      sendConcept,
      sendStatus,
    } = this.props;
    if (!loaded) return <div>data loading</div>;
    return (
      <ConceptSend
        id={id}
        prefLabelLg1={prefLabelLg1}
        isValidated={isValidated}
        sendStatus={sendStatus}
        sendConcept={sendConcept}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let prefLabelLg1, isValidated;
  const id = extractId(ownProps);
  const general = select.getGeneral(state, id);
  if (general) {
    ({ prefLabelLg1, isValidated } = general);
  }
  return {
    id,
    sendStatus: select.getStatus(state, 'send'),
    loaded: Boolean(general),
    prefLabelLg1,
    isValidated,
  };
};

const mapDispatchToProps = {
  loadGeneral,
  sendConcept,
};

ConceptSendContainer = connect(mapStateToProps, mapDispatchToProps)(
  ConceptSendContainer
);

ConceptSendContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }),
};

export default ConceptSendContainer;
