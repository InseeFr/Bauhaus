import { useId } from "react";
import { useTranslation } from "react-i18next";

import { useDisseminationStatusOptions } from "@utils/hooks/disseminationStatus";

import { componentsI18n } from "../i18n";
import { LabelRequired } from "../label-required";
import { Select } from "../select-rmes";

export const getDisseminationStatus = (disseminationStatus: string): string => {
  if (!disseminationStatus) {
    return "";
  }

  if (disseminationStatus.includes("PublicGenerique")) {
    return componentsI18n.t("disseminationStatus.DSPublicGeneriqueTitle");
  } else if (disseminationStatus.includes("PublicSpecifique")) {
    return componentsI18n.t("disseminationStatus.DSPublicSpecifiqueTitle");
  } else if (disseminationStatus.includes("Prive")) {
    return componentsI18n.t("disseminationStatus.DSPrivateTitle");
  }

  return "";
};

export const DisseminationStatusVisualization = ({
  disseminationStatus,
}: Readonly<{
  disseminationStatus: string;
}>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  return (
    <>
      {t("disseminationStatus.title")} : {getDisseminationStatus(disseminationStatus)}
    </>
  );
};

interface DisseminationStatusInputTypes {
  value: string;
  handleChange: (value: string) => void;
  required?: boolean;
  withLabel?: boolean;
}

export const DisseminationStatusInput = ({
  value,
  handleChange,
  required = false,
  withLabel = true,
}: Readonly<DisseminationStatusInputTypes>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const disseminationStatusListOptions = useDisseminationStatusOptions();

  const inputId = useId();

  return (
    <>
      {withLabel &&
        (required ? (
          <LabelRequired htmlFor={inputId}>{t("disseminationStatus.title")}</LabelRequired>
        ) : (
          <label htmlFor={inputId}>{t("disseminationStatus.title")}</label>
        ))}
      <Select
        inputId={inputId}
        placeholder={t("disseminationStatus.placeholder")}
        value={value}
        options={disseminationStatusListOptions}
        onChange={handleChange}
      />
    </>
  );
};
