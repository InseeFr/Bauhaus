import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import { maxLengthScopeNote } from 'config/config';
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

class EditorHtml extends Component {
  constructor(props) {
    super(props);
    const { text } = props;
    this.state = {
      editorState: editorStateFromHtml(text),
    };
    this.handleChange = editorState => {
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
  text: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

//TODO create a `replaceAll` function which takes a string as its first
//arguement instead of overriding the `prototype`.
String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

//TODO `editorLength` should be renamed `htmlTextLength` and stay in its
//own file. Plus, it should rely on a `htmlToRawText` function.
export const editorLength = text => {
  return text
    .replaceAll('<p><br></p>', '')
    .replaceAll('<p>', '')
    .replaceAll('</p>', '')
    .replaceAll('&nbsp;', '')
    .replaceAll('<ul>\n  <li>', '')
    .replaceAll('<ol>\n  <li>', '')
    .replaceAll('</li>\n  <li>', ' ')
    .replaceAll('</li>\n</ul>', '')
    .replaceAll('</li>\n</ol>', '')
    .replaceAll('<br>', '')
    .trim().length;
};

//TODO `editorLengthText` does not need its own function (it can be processed
//inline when needed).
export const editorLengthText = text => {
  return editorLength(text) + '/' + maxLengthScopeNote;
};

export default EditorHtml;
