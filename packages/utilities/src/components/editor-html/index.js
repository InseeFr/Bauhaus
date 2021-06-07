import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'react-draft-wysiwyg';
import './editor-html.scss';
import * as HTMLUtils from '../../utils/html-utils';
import { DeleteButton } from './editor-markdown';

const toolbar = {
	options: ['list', 'inline'],
	list: {
		inDropdown: false,
		className: undefined,
		options: ['unordered', 'ordered'],
	},
	inline: {
		options: ['bold', 'italic'],
	},
};

class EditorHTML extends Component {
	constructor(props) {
		super(props);
		const { text } = props;
		this.state = {
			editorState: HTMLUtils.editorStateFromHtml(text || ''),
		};
		this.handleChange = editorState => {
			this.setState({
				editorState,
			});
			this.props.handleChange(HTMLUtils.htmlFromEditorState(editorState));
		};
		//If we only update the parent props when we leave the editor,
		//some controls appear as disabled even if the editor has some content.
		//Hence this approach (with `onBlur`) has been desactivated and we give
		//back the `html` to the parent component every time a key is pressed.
		this.handleLeave = () =>
			this.props.handleChange(
				HTMLUtils.htmlFromEditorState(this.state.editorState)
			);
	}

	componentWillReceiveProps({ text }) {
		if (this.props.smart) return;
		this.setState({
			editorState: HTMLUtils.editorStateFromHtml(text || ''),
		});
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.smart ? nextState !== this.state : true;
	}

	render() {
		return (
			<Editor
				toolbarCustomButtons={[<DeleteButton />]}
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

EditorHTML.propTypes = {
	text: PropTypes.string,
	handleChange: PropTypes.func.isRequired,
	//if smart is set to true, the editor will not react when receiving new props
	smart: PropTypes.bool,
};

export default EditorHTML;
