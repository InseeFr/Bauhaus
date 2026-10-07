import { Editor, EditorTextChangeEvent } from "primereact/editor";
import type Quill from "quill";
import type Toolbar from "quill/modules/toolbar";
import { useEffect, useRef, useState } from "react";

import { cleanHtml } from "@utils/html-utils";

import "./editor-html.css";

const modules = {
  toolbar: {
    container: [["bold", "italic"], [{ list: "bullet" }, { list: "ordered" }], ["erase"]],
    handlers: {
      erase(this: Toolbar) {
        this.quill.setText("", "user");
      },
    },
  },
};

const formats = ["bold", "italic", "list"];

/**
 * `getSemanticHTML` de Quill 2 écrit chaque espace en `&nbsp;` et une ligne vide
 * en `<p></p>`. On revient au HTML que produisait draft-js, celui des notes en
 * base : sinon une note retouchée changerait partout.
 */
const quillHtmlToNoteHtml = (html: string) =>
  cleanHtml(html.replaceAll("&nbsp;", " ").replaceAll("<p></p>", "<p><br></p>"));

interface EditorHTMLTypes {
  handleChange: (value: string) => void;
  smart: boolean;
  ariaLabel?: string;
  text: string;
}

export const EditorHTML = ({ handleChange, smart, ariaLabel, text }: EditorHTMLTypes) => {
  const [value, setValue] = useState(text || "");
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (!smart) setValue(text || "");
  }, [smart, text]);

  // Seules les saisies de l'utilisateur comptent : le chargement de la note
  // (source `api`) ne doit pas la marquer comme modifiée.
  const onTextChange = ({ source }: EditorTextChangeEvent) => {
    if (source !== "user") return;
    const quill = editorRef.current?.getQuill();
    if (quill) handleChange(quillHtmlToNoteHtml(quill.getSemanticHTML()));
  };

  // Quill ne donne aucun rôle à sa zone éditable, contrairement à draft-js, ni
  // d'icône ou de nom lisible à un bouton qui n'est pas un format.
  const onLoad = (quill: Quill) => {
    quill.root.setAttribute("role", "textbox");
    quill.root.setAttribute("aria-multiline", "true");
    if (ariaLabel) quill.root.setAttribute("aria-label", ariaLabel);

    const toolbar = quill.getModule("toolbar") as Toolbar;
    const erase = toolbar.container?.querySelector(".ql-erase");
    if (erase) {
      erase.setAttribute("aria-label", "Delete");
      erase.setAttribute("title", "Delete");
      erase.innerHTML = '<i class="pi pi-eraser" aria-hidden="true"></i>';
    }
  };

  return (
    <Editor
      ref={editorRef}
      value={value}
      onTextChange={onTextChange}
      onLoad={onLoad}
      showHeader={false}
      modules={modules}
      formats={formats}
      className="editor-html"
    />
  );
};
