import { useId } from "react";

import { useDisseminationStatusOptions } from "@utils/hooks/disseminationStatus";

import D from "../i18n";
import { LabelRequired } from "../label-required";
import { Select } from "../select-rmes";

export const getDisseminationStatus = (disseminationStatus: string): string => {
  if (!disseminationStatus) {
    return "";
  }

  if (disseminationStatus.includes("PublicGenerique")) {
    return D.disseminationStatus.DSPublicGeneriqueTitle;
  } else if (disseminationStatus.includes("PublicSpecifique")) {
    return D.disseminationStatus.DSPublicSpecifiqueTitle;
  } else if (disseminationStatus.includes("Prive")) {
    return D.disseminationStatus.DSPrivateTitle;
  }

  return "";
};

export const DisseminationStatusVisualisation = ({
  disseminationStatus,
}: Readonly<{
  disseminationStatus: string;
}>) => {
  return (
    <>
      {D.disseminationStatus.title} : {getDisseminationStatus(disseminationStatus)}
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
  const disseminationStatusListOptions = useDisseminationStatusOptions();

  const inputId = useId();

  return (
    <>
      {withLabel &&
        (required ? (
          <LabelRequired htmlFor={inputId}>{D.disseminationStatus.title}</LabelRequired>
        ) : (
          <label htmlFor={inputId}>{D.disseminationStatus.title}</label>
        ))}
      <Select
        inputId={inputId}
        placeholder={D.disseminationStatus.placeholder}
        value={value}
        options={disseminationStatusListOptions}
        onChange={handleChange}
      />
    </>
  );
};
