import React from 'react';
import PropTypes from 'prop-types';

function PageTitle({ title, subtitle }) {
  return (
    <div className="row">
      <div className="col-md-10 centered col-md-offset-1">
        <h2 className="page-title">
          {title}
          {subtitle &&
            <div>
              &quot; {subtitle} &quot;
            </div>}
        </h2>
      </div>
    </div>
  );
}

PageTitle.proptTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default PageTitle;
