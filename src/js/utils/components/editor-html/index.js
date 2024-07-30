import { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import './editor-html.scss';
import {
	editorStateFromHtml,
	htmlFromEditorState,
} from '../../../new-architecture/utils/html-utils';
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
			editorState: editorStateFromHtml(text || ''),
		};
		this.handleChange = (editorState) => {
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

export default EditorHTML;
