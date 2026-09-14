import { useTranslation } from "react-i18next";

export const SimsBlockWithoutObject = () => {
  const { t } = useTranslation();

  return <p>{t("sims.simsWithoutObject")}</p>;
};
