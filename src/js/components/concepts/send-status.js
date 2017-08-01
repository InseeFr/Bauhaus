import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import Loadable from 'react-loading-overlay';
import { dictionary } from 'js/utils/dictionary';
import { PENDING, OK, ERROR } from 'js/constants';

function ConceptSendStatus({ label, status, urlBack }) {
  if (status === PENDING)
    return (
      <Loadable
        active={true}
        spinner
        text={dictionary.loadable.sending}
        color="#457DBB"
        background="grey"
        spinnerSize="400px"
      />
    );

  //send status OK or ERROR

  const title =
    status === OK
      ? dictionary.concept.send.success([label])
      : dictionary.concept.send.failed([label]);

  return (
    <div className="container">
      <div className="row centered">
        <div className="col-md-12">
          <h2>
            {title}
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Link
            className="btn btn-primary btn-lg col-md-2 col-md-offset-5"
            to={urlBack}>
            {dictionary.buttons.return}
          </Link>
        </div>
      </div>
    </div>
  );
}

ConceptSendStatus.propTypes = {
  status: PropTypes.oneOf([OK, PENDING, ERROR]),
  urlBack: PropTypes.string.isRequired,
};

export default ConceptSendStatus;
