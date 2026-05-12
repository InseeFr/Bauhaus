import { useTranslation } from "react-i18next";

import { CollectionExportFormat } from "@model/concepts/collection";

import ExportButton from "../CollectionDropdown";

interface ExportButtonsTypes {
  disabled?: boolean;
  exportHandler: (
    type: CollectionExportFormat,
    withConcepts: boolean,
    lang?: "lg1" | "lg2",
  ) => void;
}

const ExportButtons = ({ exportHandler, disabled }: Readonly<ExportButtonsTypes>) => {
  const { t } = useTranslation();
  return (
    <ExportButton
      disabled={disabled}
      actions={[
        <button key="ods-export" type="button" onClick={() => exportHandler("ods", false)}>
          {t("common.btnOdsExporter")}
        </button>,
        <button key="odt-export-lg1" type="button" onClick={() => exportHandler("odt", false)}>
          {t("common.btnOdtLg1Exporter")}
        </button>,
        <button
          key="odt-export-lg2"
          type="button"
          onClick={() => exportHandler("odt", false, "lg2")}
        >
          {t("common.btnOdtLg2Exporter")}
        </button>,
        <button key="collection-export" type="button" onClick={() => exportHandler("odt", true)}>
          {t("common.btnCollectionConceptExporter")}
        </button>,
      ]}
    ></ExportButton>
  );
};
export default ExportButtons;
