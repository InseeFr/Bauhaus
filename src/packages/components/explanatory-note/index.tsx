import DOMPurify from "dompurify";

import Editor from "@uiw/react-md-editor";
import { Note } from "../note";

interface ExplanatoryNoteTypes {
  text?: string | any;
  title: string;
  alone?: boolean;
  md?: boolean;
}
export const ExplanatoryNote = ({ text, title, alone, md }: Readonly<ExplanatoryNoteTypes>) => {
  const cl = alone ? "col-md-12" : "col-md-6";
  if (!text) return <div className={cl} />;

  const newText = text.replace(
    /href="http:\/\/.+?\/codes\/(.+?)\/.+?\/(.+?)"/g,
    `href="${window.location.origin}/classifications/classification/$1/item/$2"`
  );

  if (md) {
    return <Note title={title} alone={alone} text={<Editor.Markdown source={newText} />}></Note>;
  }
  return (
    <Note
      title={title}
      alone={alone}
      text={
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(newText),
          }}
        />
      }
    ></Note>
  );
};
