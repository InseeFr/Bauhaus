import { useTranslation } from "react-i18next";

import { useStructures } from "@utils/hooks/structures";

export const DataStructure = ({ dataStructure }: Readonly<{ dataStructure: string }>) => {
  const { t } = useTranslation();

  const { data: structures } = useStructures();

  return (
    <>
      {t("dataset.statisticalInformation.dataStructure.title")} :{" "}
      {structures?.find((t) => dataStructure === t.iri)?.labelLg1 ?? dataStructure}
    </>
  );
};
