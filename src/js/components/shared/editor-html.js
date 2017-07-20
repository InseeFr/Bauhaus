import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './editor-html.css';
import { htmlToRawText } from 'js/utils/html';

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

const rNewLine = /\n/g;
const rUselessSpace = /(>)\s*(<)/g;
//HACK avoid new lines in the html. Not safe: some new lines might impact the
//rendered html (as a whitespace does). For notes edited with the html editor,
//new lines seem to appear only in list (between `<li>`), so it seems
//acceptable. If we edited some notes which were not firstly written with this
//editor, it would not safe anymore.
function htmlFromEditorState(editorState) {
  const html = stateToHTML(editorState.getCurrentContent());
  const rawText = htmlToRawText(html);
  if (rawText === '') return '';
  return html.replace(rNewLine, '').replace(rUselessSpace, '$1$2');
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
    };
    this.handleLeave = () =>
      this.props.handleChange(htmlFromEditorState(this.state.editorState));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
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
        onBlur={this.handleLeave}
      />
    );
  }
}

EditorHtml.propTypes = {
  text: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default EditorHtml;
