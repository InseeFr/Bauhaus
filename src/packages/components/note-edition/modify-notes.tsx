import { orderedListCommand } from "@uiw/react-md-editor/nohighlight";
import { useState } from "react";

import { markdownToNoteHtml, noteHtmlToMarkdown } from "@utils/note-markdown";

import { MDEditor } from "../rich-editor/react-md-editor";

/**
 * Note de concept, stockée en HTML et éditée en markdown comme le reste de
 * l'application. Tant que le markdown est celui obtenu à l'ouverture, la note
 * renvoyée est le HTML reçu à l'octet près : rouvrir une note sans y toucher
 * ne la réécrit pas.
 */
export function ModifyNotes({
  note,
  handleChange,
  ariaLabel,
}: Readonly<{ note: string; handleChange: (value: string) => void; ariaLabel?: string }>) {
  const [original] = useState(() => ({ html: note, markdown: noteHtmlToMarkdown(note) }));
  const [markdown, setMarkdown] = useState(original.markdown);

  const onChange = (value = "") => {
    setMarkdown(value);
    if (value === original.markdown) handleChange(original.html);
    else if (value.trim() === "") handleChange("");
    else handleChange(markdownToNoteHtml(value));
  };

  return (
    <MDEditor
      text={markdown}
      handleChange={onChange}
      extraCommands={[orderedListCommand]}
      textareaProps={{ "aria-label": ariaLabel }}
    />
  );
}
