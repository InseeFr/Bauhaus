import { Component } from 'react';
//@ts-ignore
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
	editorStateFromHtml,
	htmlFromEditorState,
} from '../../utils/html-utils';
import './editor-html.scss';
import { EditorDeleteButton } from './editor-markdown';

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

type EditorHTMLTypes = {
	handleChange: (value: string) => void;
	smart: boolean;
	ariaLabel?: string;
	id?: string;
	text: string;
};
type EditorHTMLState = {
	editorState: any;
};

export class EditorHTML extends Component<EditorHTMLTypes, EditorHTMLState> {
	constructor(props: EditorHTMLTypes) {
		super(props);
		const { text } = props;
		this.state = {
			editorState: editorStateFromHtml(text || ''),
		};
	}

	handleChange = (editorState: any) => {
		this.setState({
			editorState,
		});
		this.props.handleChange(htmlFromEditorState(editorState));
	};
	handleLeave = () =>
		this.props.handleChange(htmlFromEditorState(this.state.editorState));

	componentWillReceiveProps({ text }: { text: string }) {
		if (this.props.smart) return;
		this.setState({
			editorState: editorStateFromHtml(text || ''),
		});
	}

	shouldComponentUpdate(
		nextProps: EditorHTMLTypes,
		nextState: EditorHTMLState,
	) {
		return this.props.smart ? nextState !== this.state : true;
	}

	render() {
		return (
			<Editor
				toolbarCustomButtons={[<EditorDeleteButton />]}
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
