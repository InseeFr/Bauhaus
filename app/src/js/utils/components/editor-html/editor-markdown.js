import React, { useEffect, useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import './editor-html.scss';
import { getLang } from '@inseefr/wilco';
import { EditorState } from 'draft-js';

import * as HTMLUtils from '../../utils/html-utils';

export const DeleteButton = ({ onChange }) => {
	const erease = () => {
		onChange(EditorState.createEmpty());
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
export const toolbar = {
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

const EditorMarkdown = ({ text, handleChange }) => {
	const [editorState, setEditorState] = useState(
		HTMLUtils.editorStateFromMd('')
	);
	const editorRef = useRef();

	useEffect(() => {
		setEditorState(HTMLUtils.editorStateFromMd(text || ''));
	}, [text]);

	const handleLeave = () => {
		handleChange(HTMLUtils.mdFromEditorState(editorState));
	};

	return (
		<Editor
			toolbarCustomButtons={[<DeleteButton />]}
			ref={editorRef}
			editorState={editorState}
			toolbar={toolbar}
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

export default EditorMarkdown;
