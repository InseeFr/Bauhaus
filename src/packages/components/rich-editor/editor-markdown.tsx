//@ts-ignore
import { EditorState } from 'draft-js';
import { useEffect, useRef, useState } from 'react';
//@ts-ignore
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { getLang } from '@utils/dictionnary';
import { mdFromEditorState, editorStateFromMd } from '@utils/html-utils';

import '../note-edition';
import './editor-html.scss';

export const EditorDeleteButton = ({
	onChange,
}: {
	onChange?: (state: EditorState) => void;
}) => {
	const erease = () => {
		if (onChange) {
			onChange(EditorState.createEmpty());
		}
	};
	return (
		<div
			onClick={erease}
			className="rdw-option-wrapper"
			aria-selected="false"
			title="Delete"
		>
			<img
				alt=""
				src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBkPSJNOC4xIDE0bDYuNC03LjJjLjYtLjcuNi0xLjgtLjEtMi41bC0yLjctMi43Yy0uMy0uNC0uOC0uNi0xLjMtLjZIOC42Yy0uNSAwLTEgLjItMS40LjZMLjUgOS4yYy0uNi43LS42IDEuOS4xIDIuNWwyLjcgMi43Yy4zLjQuOC42IDEuMy42SDE2di0xSDguMXptLTEuMy0uMXMwLS4xIDAgMGwtMi43LTIuN2MtLjQtLjQtLjQtLjkgMC0xLjNMNy41IDZoLTFsLTMgMy4zYy0uNi43LS42IDEuNy4xIDIuNEw1LjkgMTRINC42Yy0uMiAwLS40LS4xLS42LS4yTDEuMiAxMWMtLjMtLjMtLjMtLjggMC0xLjFMNC43IDZoMS44TDEwIDJoMUw3LjUgNmwzLjEgMy43LTMuNSA0Yy0uMS4xLS4yLjEtLjMuMnoiLz48L3N2Zz4="
			/>
		</div>
	);
};
export const EditorMarkdownToolbar = {
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

interface EditorMarkdownTypes {
	text: string;
	handleChange: (value: any) => void;
}
export const EditorMarkdown = ({ text, handleChange }: EditorMarkdownTypes) => {
	const [editorState, setEditorState] = useState(() => editorStateFromMd(''));
	const editorRef = useRef();

	useEffect(() => {
		setEditorState(editorStateFromMd(text || ''));
	}, [text]);

	const handleLeave = () => {
		handleChange(mdFromEditorState(editorState));
	};

	return (
		<Editor
			toolbarCustomButtons={[<EditorDeleteButton key="delete" />]}
			ref={editorRef}
			editorState={editorState}
			toolbar={EditorMarkdownToolbar}
			toolbarClassName="home-toolbar"
			wrapperClassName="home-wrapper"
			editorClassName="home-editor"
			onEditorStateChange={setEditorState}
			onBlur={handleLeave}
			stripPastedStyles={true}
			localization={{
				locale: getLang(),
			}}
		/>
	);
};
