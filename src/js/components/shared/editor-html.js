import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './editor-html.css';
import { htmlFromEditorState, editorStateFromHtml } from 'js/utils/html';

const toolbar = {
	options: ['list'],
	list: {
		inDropdown: false,
		className: undefined,
		options: ['unordered', 'ordered'],
	},
};

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
		//If we only update the parent props when we leave the editor,
		//some controls appear as disabled even if the editor has some content.
		//Hence this approach (with `onBlur`) has been desactivated and we give
		//back the `html` to the parent component every time a key is pressed.
		//TODO check if there is no performance issue
		this.handleLeave = () =>
			this.props.handleChange(htmlFromEditorState(this.state.editorState));
	}

	componentWillReceiveProps({ text }) {
		if (this.props.smart) return;
		this.setState({
			editorState: editorStateFromHtml(text || ''),
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.smart ? nextState !== this.state : true;
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
				// onBlur={this.handleLeave}
			/>
		);
	}
}

EditorHtml.propTypes = {
	text: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	//if smart is set to true, the editor will not react when receiving new props
	smart: PropTypes.bool,
};

export default EditorHtml;
