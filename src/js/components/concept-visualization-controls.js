import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';

const Button = ({ action, label }) => {
  let button;
  if (typeof action === 'string') {
    button = (
      <button className="btn btn-primary btn-lg col-md-12">
        <Link to={action}>
          {label}
        </Link>
      </button>
    );
  } else {
    //if action is a function, it means a handler was passed in instead of an URL
    button = (
      <button className="btn btn-primary btn-lg col-md-12" onClick={action}>
        {label}
      </button>
    );
  }
  return (
    <div className="col-md-2">
      {button}
    </div>
  );
};
Button.propTypes = {
  //handler or url
  action: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
};

function ConceptVisualizationControls({
  isValidated,
  conceptVersion,
  id,
  handleValidation,
}) {
  let btns;
  const cancel = ['/concepts', dictionary.buttons.return];
  const send = [`/concept/${id}/send`, dictionary.buttons.send];
  const validate = [handleValidation, dictionary.buttons.validate];
  const update = [`/concept/${id}/modify`, dictionary.buttons.modify];
  const compare = [`/concept/${id}/compare`, dictionary.buttons.compare];

  if (!conceptVersion || conceptVersion <= 1) {
    btns = isValidated
      ? [cancel, null, null, null, send, update]
      : [cancel, null, null, send, update, validate];
  } else {
    // conceptVersion > 1
    btns = isValidated
      ? [cancel, null, null, compare, send, update]
      : [cancel, null, compare, send, update, validate];
  }
  return (
    <div className="row btn-line">
      {btns.map(btn => {
        if (!btn) return null;
        const [action, label] = btn;
        return btn && <Button key={label} action={action} label={label} />;
      })}
    </div>
  );
}

ConceptVisualizationControls.propTypes = {
  id: PropTypes.string.isRequired,
  isValidated: PropTypes.bool.isRequired,
  conceptVersion: PropTypes.string,
  handleValidation: PropTypes.func.isRequired,
};

export default ConceptVisualizationControls;
