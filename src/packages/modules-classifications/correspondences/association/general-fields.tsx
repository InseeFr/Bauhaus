import { Link } from "react-router-dom";

import D from "../../../deprecated-locales";

const mapping = {
  sourceItemLabelLg1: D.sourceItemTitle,
  targetItemLabelLg1: D.targetItemTitle,
};

interface SourceItemLabelTypes {
  label: string;
  classId: string;
  itemId: string;
  itemLabelLg1: string;
  itemLabelLg2: string;
  secondLang: boolean;
  classAltLabelLg1: string;
  classAltLabelLg2: string;
}
const SourceItemLabel = ({
  label,
  classId,
  itemId,
  itemLabelLg1,
  itemLabelLg2,
  secondLang,
  classAltLabelLg1,
  classAltLabelLg2,
}: Readonly<SourceItemLabelTypes>) => {
  return (
    <li>
      {label} :{" "}
      <Link to={`/classifications/classification/${classId}/item/${itemId}`}>
        {`${itemId} - `}
        {!secondLang ? itemLabelLg1 : itemLabelLg2}
      </Link>
      <Link to={`/classifications/classification/${classId}`}>
        {!secondLang
          ? classAltLabelLg1 && ` (${classAltLabelLg1})`
          : classAltLabelLg2 && ` (${classAltLabelLg2})`}
      </Link>
    </li>
  );
};
export const generalFields = (association: any, secondLang: boolean) => {
  const {
    sourceClassId,
    targetClassId,
    sourceItemId,
    targetItemId,
    sourceItemLabelLg1,
    sourceItemLabelLg2,
    targetItemLabelLg1,
    targetItemLabelLg2,
    sourceClassAltLabelLg1,
    sourceClassAltLabelLg2,
    targetClassAltLabelLg1,
    targetClassAltLabelLg2,
  } = association;
  const content = Object.keys(mapping).map((fieldName) => {
    if (fieldName === "sourceItemLabelLg1" && association[fieldName]) {
      return (
        <SourceItemLabel
          key="sourceItemLabelLg1"
          label={mapping[fieldName]}
          secondLang={secondLang}
          classId={sourceClassId}
          itemId={sourceItemId}
          classAltLabelLg1={sourceClassAltLabelLg1}
          classAltLabelLg2={sourceClassAltLabelLg2}
          itemLabelLg1={sourceItemLabelLg1}
          itemLabelLg2={sourceItemLabelLg2}
        />
      );
    }
    if (fieldName === "targetItemLabelLg1" && association[fieldName]) {
      return (
        <SourceItemLabel
          key="sourceItemLabelLg2"
          label={mapping[fieldName]}
          secondLang={secondLang}
          classId={targetClassId}
          itemId={targetItemId}
          classAltLabelLg1={targetClassAltLabelLg1}
          classAltLabelLg2={targetClassAltLabelLg2}
          itemLabelLg1={targetItemLabelLg1}
          itemLabelLg2={targetItemLabelLg2}
        />
      );
    }

    return null;
  });

  return <ul>{content}</ul>;
};
