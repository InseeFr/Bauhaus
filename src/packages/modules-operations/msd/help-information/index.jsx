import D from "../../../deprecated-locales";
import { rangeType } from "../../utils/msd";
import { List } from "@components/ui/list-group";

const { CODE_LIST, ORGANIZATION } = rangeType;

export default function HelpInformation({ msd, codesLists, organisations }) {
  if (!msd.masLabelLg1) {
    return null;
  }
  return (
    <dl>
      <dt>{D.labelTitle}:</dt>
      <dd>{msd.masLabelLg2}</dd>
      <dt>{D.helpPresentational}:</dt>
      <dd>{msd.isPresentational.toString()}</dd>
      {msd.maxOccurs && (
        <>
          <dt>{D.helpMaxOccurs}:</dt>
          <dd>{msd.maxOccurs}</dd>
        </>
      )}
      <dt>{D.helpRange}:</dt>
      <dd>
        {msd.rangeType === CODE_LIST && codesLists[msd.codeList]
          ? `${D[`help${msd.rangeType}`]} - ${codesLists[msd.codeList].codeListLabelLg1}`
          : `${D[`help${msd.rangeType}`]}`}

        {msd.rangeType === CODE_LIST && codesLists[msd.codeList] && (
          <List.Container>
            {codesLists[msd.codeList]?.codes.map((code) => (
              <List.Item key={code.code}>{code.labelLg1}</List.Item>
            ))}
          </List.Container>
        )}
        {msd.rangeType === ORGANIZATION && (
          <List.Container>
            {organisations.map((orga) => (
              <List.Item key={orga.id}>{orga.label}</List.Item>
            ))}
          </List.Container>
        )}
      </dd>
    </dl>
  );
}
