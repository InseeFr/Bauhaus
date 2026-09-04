import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { ErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { Select } from "@components/select-rmes";

import { GeographieApi } from "@sdk/geographie";

import { useGeographies } from "../hooks/useGeographies";
import { GeographyOption } from "../hooks/useGeographiesOptions";
import { Geography, SimsGeographySelector } from "./SimsGeographySelector";

export interface SimsTerritory {
  id?: string;
  uri?: string;
  labelLg1?: string;
  labelLg2?: string;
  unions?: { uri: string }[];
  difference?: { uri: string }[];
}

export interface SimsGeographyFieldTypes {
  onCancel: () => void;
  onSave: (uri?: string) => void;
  territory?: SimsTerritory;
}

export const SimsGeographyField = ({
  onCancel,
  onSave,
  territory = {},
}: Readonly<SimsGeographyFieldTypes>) => {
  const { t } = useTranslation();

  const [name, setName] = useState(territory.labelLg1 ?? "");

  const [nameLg2, setNameLg2] = useState(territory.labelLg2 ?? "");

  const [selectedOption, setSelectedOption] = useState<GeographyOption | null>(null);

  const [serverSideError, setServerSideError] = useState("");

  const { isLoading, geographies, includes, excludes, setIncludes, setExcludes } =
    useGeographies(territory);

  const handleSelect = useCallback(
    (value: string) => {
      const newValue = geographies.find((g) => g.value === value);
      setSelectedOption(newValue ?? null);
    },
    [geographies],
  );

  const include = () => {
    setIncludes([...includes, selectedOption ?? undefined]);
    setSelectedOption(null);
  };

  const exclude = () => {
    setExcludes([...excludes, selectedOption ?? undefined]);
    setSelectedOption(null);
  };

  const onRemoveExclude = useCallback(
    (geography: Geography) => {
      setExcludes(excludes.filter((g) => g?.value !== geography.value));
    },
    [excludes, setExcludes],
  );

  const onRemoveInclude = useCallback(
    (geography: Geography) => {
      setIncludes(includes.filter((g) => g?.value !== geography.value));
    },
    [includes, setIncludes],
  );

  const save = useCallback(() => {
    const formatted = {
      ...territory,
      labelLg1: name,
      labelLg2: nameLg2,
      unions: includes.map((i) => ({ uri: i!.value })),
      difference: excludes.map((i) => ({ uri: i!.value })),
    };
    const method = formatted.id
      ? GeographieApi.putTerritory(formatted.id, formatted)
      : GeographieApi.postTerritory(formatted);
    method
      .then((uri: unknown) => {
        onSave(territory.uri ?? (uri as string));
      })
      .catch((err: unknown) => setServerSideError(JSON.parse(err as string).message));
  }, [territory, name, nameLg2, includes, excludes, onSave]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-100 container">
      <ActionToolbar>
        <CancelButton action={onCancel} />
        <SaveButton action={save} />
      </ActionToolbar>
      <ErrorBloc error={serverSideError} />
      <Row>
        <div className="form-group col-md-6">
          <LabelRequired className="form-label w-100">
            {t("geography.zoneName", { lng: "fr" })}
          </LabelRequired>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group col-md-6">
          <LabelRequired className="form-label w-100">
            {t("geography.zoneName", { lng: "en" })}
          </LabelRequired>
          <TextInput value={nameLg2} onChange={(e) => setNameLg2(e.target.value)} />
        </div>
      </Row>
      <div className="bauhaus-sims-geography-field">
        <div className="form-group">
          <Select
            value={selectedOption?.value ?? null}
            options={geographies}
            onChange={(value) => handleSelect(value)}
            placeholder=""
          />
        </div>
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-default"
            disabled={!selectedOption}
            onClick={include}
          >
            {t("geography.include")}
          </button>
          <button
            type="button"
            className="btn btn-default"
            disabled={!selectedOption}
            onClick={exclude}
          >
            {t("geography.exclude")}
          </button>
        </div>
      </div>
      <SimsGeographySelector
        includes={includes as Geography[]}
        excludes={excludes as Geography[]}
        onRemoveExclude={onRemoveExclude}
        onRemoveInclude={onRemoveInclude}
      />
    </div>
  );
};
