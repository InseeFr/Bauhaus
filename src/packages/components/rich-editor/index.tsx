import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { editorStateFromHtml, htmlFromEditorState } from "@utils/html-utils";

import "./editor-html.css";
import { EditorDeleteButton } from "./editor-markdown";

const toolbar = {
  options: ["list", "inline"],
  list: {
    inDropdown: false,
    className: undefined,
    options: ["unordered", "ordered"],
  },
  inline: {
    options: ["bold", "italic"],
  },
};

interface EditorHTMLTypes {
  handleChange: (value: string) => void;
  smart: boolean;
  ariaLabel?: string;
  text: string;
}

export const EditorHTML = ({ handleChange, smart, ariaLabel, text }: EditorHTMLTypes) => {
  const [editorState, setEditorState] = useState(() => editorStateFromHtml(text || ""));

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (smart) return;
    setEditorState(editorStateFromHtml(text || ""));
  }, [text]);

  const onChange = (newEditorState: any) => {
    setEditorState(newEditorState);
    handleChange(htmlFromEditorState(newEditorState));
  };

  return (
    <Editor
      toolbarCustomButtons={[<EditorDeleteButton key="delete" />]}
      ariaLabel={ariaLabel}
      editorState={editorState}
      toolbar={toolbar}
      toolbarClassName="home-toolbar"
      wrapperClassName="home-wrapper"
      editorClassName="home-editor"
      onEditorStateChange={onChange}
    />
  );
};
