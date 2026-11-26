import { ReactNode } from "react";

import { cx } from "@utils/cx";

import { Panel } from "../panel";

interface NoteTypes {
  text?: string | any;
  title: ReactNode;
  alone?: boolean;
  allowEmpty?: boolean;
  alt?: string;
}

export const Note = ({
  text = "",
  title,
  alone,
  allowEmpty = false,
  alt = "",
}: Readonly<NoteTypes>) => {
  if (!text && !allowEmpty) return null;

  const cl = alone ? "col-12" : "col-12 lg:col-6";

  return (
    <div className={cx("note", cl)} title={alt}>
      <Panel title={title}>{text}</Panel>
    </div>
  );
};
