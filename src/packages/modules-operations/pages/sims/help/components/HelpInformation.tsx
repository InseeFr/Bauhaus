import { useTranslation } from "react-i18next";

import { List } from "@components/ui/list-group";

import { rangeType } from "../../../../constants/rangeType";

const { CODE_LIST, ORGANIZATION } = rangeType;

interface HelpInformationTypes {
  msd: any;
  codelists?: any;
  organizations?: any[];
}

export function HelpInformation({ msd, codelists, organizations }: Readonly<HelpInformationTypes>) {
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
        {(() => {
          const rangeLabel = t(`sims.help${msd.rangeType}`);
          return msd.rangeType === CODE_LIST && codelists[msd.codeList]
            ? `${rangeLabel} - ${codelists[msd.codeList].codeListLabelLg1}`
            : rangeLabel;
        })()}

        {msd.rangeType === CODE_LIST && codelists[msd.codeList] && (
          <List.Container>
            {codelists[msd.codeList]?.codes.map((code: any) => (
              <List.Item key={code.code}>{code.labelLg1}</List.Item>
            ))}
          </List.Container>
        )}
        {msd.rangeType === ORGANIZATION && (
          <List.Container>
            {organizations!.map((orga) => (
              <List.Item key={orga.id}>{orga.label}</List.Item>
            ))}
          </List.Container>
        )}
      </dd>
    </dl>
  );
}
