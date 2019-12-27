import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './editor-html.scss';
import { htmlFromEditorState, editorStateFromHtml } from 'js/utils/html';

const toolbar = {
	options: ['list'],
	list: {
		inDropdown: false,
		className: undefined,
		options: ['unordered', 'ordered'],
	},
};

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
				ariaLabel={this.props.ariaLabel}
				editorState={this.state.editorState}
				id={this.props.id}
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
	//if smart is set to true, the editor will not react when receiving new props
	smart: PropTypes.bool,
};

export default EditorHtml;
