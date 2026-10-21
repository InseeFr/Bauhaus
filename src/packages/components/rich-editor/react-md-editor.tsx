import Editor, { bold, italic, unorderedListCommand, link } from "@uiw/react-md-editor/nohighlight";
import { ComponentProps } from "react";

export const MDEditor = ({
  text,
  handleChange,
  ...props
}: Readonly<
  {
    text?: string;
    handleChange: (value?: string) => void;
  } & Omit<ComponentProps<typeof Editor>, "value" | "onChange" | "commands" | "preview">
>) => {
  return (
    <Editor
      {...props}
      value={text}
      onChange={handleChange}
      commands={[italic, bold, unorderedListCommand, link]}
      preview="edit"
      // Sans plein écran dans les commandes, inutile que chaque éditeur lise puis réécrive
      // l'overflow du <body> au montage : la fiche SIMS en monte des dizaines.
      overflow={false}
      data-color-mode="light"
    />
  );
};
