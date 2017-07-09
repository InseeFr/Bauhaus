import React from 'react';
import PropTypes from 'prop-types';

function NotesTab({ title, children }) {
  return (
    <Tab title={scopeNoteTabLabel} style={{ marginTop: '20px' }}>
      {children}
    </Tab>
  );
}

NotesTab.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  children: PropTypes.element.isRequired,
};
export default NotesTab;
