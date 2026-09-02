import { useTranslation } from "react-i18next";

import { List } from "@components/ui/list-group";

import { rangeType } from "../../../../constants/rangeType";

const { CODE_LIST, ORGANIZATION } = rangeType;

export function HelpInformation({ msd, codelists, organizations }) {
  const { t } = useTranslation();

  if (!msd.masLabelLg1) {
    return null;
  }

  return (
    <dl>
      <dt>{t("app.labelTitle")}:</dt>
      <dd>{msd.masLabelLg2}</dd>
      <dt>{t("sims.helpPresentational")}:</dt>
      <dd>{msd.isPresentational.toString()}</dd>
      {msd.maxOccurs && (
        <>
          <dt>{t("sims.helpMaxOccurs")}:</dt>
          <dd>{msd.maxOccurs}</dd>
        </>
      )}
      <dt>{t("sims.helpRange")}:</dt>
      <dd>
        {msd.rangeType === CODE_LIST && codelists[msd.codeList]
          ? `${t(`sims.help${msd.rangeType}`)} - ${codelists[msd.codeList].codeListLabelLg1}`
          : `${t(`sims.help${msd.rangeType}`)}`}

        {msd.rangeType === CODE_LIST && codelists[msd.codeList] && (
          <List.Container>
            {codelists[msd.codeList]?.codes.map((code) => (
              <List.Item key={code.code}>{code.labelLg1}</List.Item>
            ))}
          </List.Container>
        )}
        {msd.rangeType === ORGANIZATION && (
          <List.Container>
            {organizations.map((orga) => (
              <List.Item key={orga.id}>{orga.label}</List.Item>
            ))}
          </List.Container>
        )}
      </dd>
    </dl>
  );
}
