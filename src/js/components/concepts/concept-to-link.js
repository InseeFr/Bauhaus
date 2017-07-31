import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'js/utils/panel';

function ConceptToLink({ title, memberEls, removeMember, searchComponent }) {
  return (
    <div className="row">
      <div className="col-md-6">
        <Panel title={title}>
          {memberEls}
        </Panel>
      </div>
      <div className="col-md-6 centered">
        {searchComponent}
      </div>
    </div>
  );
}

ConceptToLink.propTypes = {
  title: PropTypes.string.isRequired,
  memberEls: PropTypes.arrayOf(PropTypes.element).isRequired,
  searchComponent: PropTypes.element.isRequired,
};

export default ConceptToLink;
