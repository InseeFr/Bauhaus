import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import { maxLengthScopeNote } from '../../config/config';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../css/app.css';

class EditorHtml extends Component {
  render() {
    const toolbar = {
      options: ['list'],
      list: {
        inDropdown: false,
        className: undefined,
        options: ['unordered', 'ordered'],
      },
    };

    return (
      <div>
        <Editor
          editorState={this.props.editor}
          toolbar={toolbar}
          toolbarClassName="home-toolbar"
          wrapperClassName="home-wrapper"
          editorClassName="home-editor"
          onEditorStateChange={this.props.onEditorChange}
        />
      </div>
    );
  }
}

String.prototype.replaceAll = function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

export const editorLength = text => {
  return stateToHTML(text.getCurrentContent())
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
export const editorLengthText = text => {
  return editorLength(text) + '/' + maxLengthScopeNote;
};

export default EditorHtml;
