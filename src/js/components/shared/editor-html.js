import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'css/app.css';

const toolbar = {
  options: ['list'],
  list: {
    inDropdown: false,
    className: undefined,
    options: ['unordered', 'ordered'],
  },
};

function editorStateFromHtml(html) {
  return EditorState.createWithContent(stateFromHTML(html));
}

function htmlFromEditorState(editorState) {
  return stateToHTML(editorState.getCurrentContent());
}
//TODO in the previous version, we used `stateToHTML(note.getCurrentContent()) !== '<p>undefined</p>'`
// see if it is still necessary.
class EditorHtml extends Component {
  constructor(props) {
    super(props);
    const { text } = props;
    this.state = {
      editorState: editorStateFromHtml(text || ''),
    };
    this.handleChange = editorState => {
      this.setState({
        editorState,
      });
      this.props.handleChange(htmlFromEditorState(editorState));
    };
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        toolbar={toolbar}
        toolbarClassName="home-toolbar"
        wrapperClassName="home-wrapper"
        editorClassName="home-editor"
        onEditorStateChange={this.handleChange}
      />
    );
  }
}

EditorHtml.propTypes = {
  text: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default EditorHtml;
