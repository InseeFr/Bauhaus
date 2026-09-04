import { useTranslation } from "react-i18next";

import { nbResults } from "@utils/array-utils";

import { componentsI18n } from "../i18n";

export const NumberResults = ({ results: data }: Readonly<{ results: any[] }>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return nbResults(data, t("results"), t("result"));
};
