import React from 'react';
import PropTypes from 'prop-types';
import LogoDel from 'js/components/logo-del';

function Member({ id, label, remove }) {
  return (
    <li key={id} className="list-group-item" onClick={remove}>
      <LogoDel />
      {label}
    </li>
  );
}

Member.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
};

export default Member;
