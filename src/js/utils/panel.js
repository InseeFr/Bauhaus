import React from 'react';
import PropTypes from 'prop-types';
import 'css/panel.css';

function Panel({ title, children }) {
  return (
    <div className="panel panel-concepts">
      <div className="panel-heading">
        <h3 className="panel-title">
          {title}
        </h3>
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
}

Panel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Panel;
