import { useTranslation } from "react-i18next";

import { stringToDate } from "@utils/date-utils";

import { componentsI18n } from "../i18n";

export const DateItem = ({ date }: Readonly<{ date?: string | null }>) => {
  if (!date || date === "") {
    return <></>;
  }

  return stringToDate(date);
};

export const CreationUpdateItems = ({
  creation,
  update,
}: Readonly<{
  creation?: string | null;
  update?: string | null;
}>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <>
      <li>
        {t("createdDateTitle")} : <DateItem date={creation} />
      </li>
      <li>
        {t("modifiedDateTitle")} : <DateItem date={update} />
      </li>
    </>
  );
};
