import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { SeeButton } from "@components/buttons/see";
import { Select } from "@components/select-rmes";
import { RightSlidingPanel } from "@components/sliding-panel";

import { HasAccess } from "../../auth/components/auth";
import { useGeographiesOptions } from "../hooks/useGeographiesOptions";
import { SimsGeographyField, SimsTerritory } from "./SimsGeographyField";
import "./SimsGeographyPicker.css";
import { SimsGeographyI18NLabel } from "./SimsGeographyI18NLabel";

const accentsMap = new Map([
  ["A", "Á|À|Ã|Â|Ä"],
  ["a", "á|à|ã|â|ä"],
  ["E", "É|È|Ê|Ë"],
  ["e", "é|è|ê|ë"],
  ["I", "Í|Ì|Î|Ï"],
  ["i", "í|ì|î|ï"],
  ["O", "Ó|Ò|Ô|Õ|Ö"],
  ["o", "ó|ò|ô|õ|ö"],
  ["U", "Ú|Ù|Û|Ü"],
  ["u", "ú|ù|û|ü"],
  ["C", "Ç"],
  ["c", "ç"],
  ["N", "Ñ"],
  ["n", "ñ"],
]);

const reducer = (acc: string, [key]: [string, string]) =>
  acc.replace(new RegExp(accentsMap.get(key)!, "g"), key);

export const removeAccents = (text: string): string => [...accentsMap].reduce(reducer, text);

export interface SimsGeographyPickerTypes {
  onChange: (value?: string) => void;
  value: string;
  loadGeographies: () => void;
  secondLang?: boolean;
}

export const SimsGeographyPicker = ({
  onChange,
  value,
  loadGeographies,
  secondLang = false,
}: Readonly<SimsGeographyPickerTypes>) => {
  const { t } = useTranslation();

  const [territory, setTerritory] = useState<SimsTerritory | undefined>();

  const { geographiesOptions } = useGeographiesOptions();

  const geographiesOptionsLg2 = geographiesOptions.map((g) => ({
    id: g.id,
    label: g.labelLg2 ?? "",
    value: g.value,
    typeTerritory: g.typeTerritory,
  }));

  const [slidingModal, setSlidingModal] = useState(false);

  const openNewPanel = useCallback(() => {
    setSlidingModal(true);
  }, []);

  const openViewPanel = useCallback(() => {
    setTerritory(
      geographiesOptions?.find(({ value: v }) => v === value)?.geography as
        | SimsTerritory
        | undefined,
    );
    setSlidingModal(true);
  }, [geographiesOptions, value]);

  const onSave = useCallback(
    (territoryUri?: string) => {
      setSlidingModal(false);
      loadGeographies();
      onChange(territoryUri);
    },
    [loadGeographies, onChange],
  );

  const onCancel = useCallback(() => {
    setTerritory(undefined);
    setSlidingModal(false);
  }, []);

  const formatOptionLabel = (geography: any) => {
    return <SimsGeographyI18NLabel geography={geography} />;
  };

  const shouldSeeViewButton =
    geographiesOptions?.find(({ value: v }) => v === value)?.typeTerritory ===
    "Territoire Statistique";

  // Ces props ne sont pas déclarées dans `SelectRmesTypes` (et donc pas
  // consommées par `Select`, cf. son implémentation) mais sont transmises
  // telles quelles depuis le composant historique : on les regroupe dans un
  // objet non littéral pour ne pas déclencher les vérifications de propriétés
  // excédentaires de TypeScript, sans changer le comportement à l'exécution.
  const extraSelectProps = {
    filterOption: (
      option: { label: string; typeTerritory: string } | undefined,
      searchValue: string,
    ) => {
      const search = removeAccents(searchValue.toLowerCase());
      const label = removeAccents(option?.label.toLowerCase() ?? "");
      const typeTerritory = removeAccents(option?.typeTerritory.toLowerCase() ?? "");
      return !searchValue || label.includes(search) || typeTerritory.includes(search);
    },
    isSearchable: true,
    noResultsText: t("geography.noResult"),
    isClearable: true,
    formatOptionLabel,
  };

  return (
    <>
      <div className="bauhaus-sims-geography-picker">
        <div className="form-group">
          <Select
            value={value}
            options={secondLang ? geographiesOptionsLg2 : geographiesOptions}
            onChange={(value) => onChange(value)}
            placeholder=""
            {...extraSelectProps}
          />
        </div>
        <HasAccess module="GEOGRAPHY" privilege="CREATE">
          <button type="button" className="btn btn-default" onClick={openNewPanel}>
            {t("geography.btnNew")}
          </button>
        </HasAccess>
        <SeeButton disabled={!shouldSeeViewButton} onClick={openViewPanel}></SeeButton>
      </div>
      <RightSlidingPanel isOpen={slidingModal} onHide={() => setSlidingModal(false)}>
        <SimsGeographyField onCancel={onCancel} onSave={onSave} territory={territory} />
      </RightSlidingPanel>
    </>
  );
};
