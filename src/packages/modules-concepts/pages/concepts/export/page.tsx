import { useTranslation } from "react-i18next";

import { Exporting, Loading } from "@components/loading";
import { Picker } from "@components/picker-page";

import { useTitle } from "@utils/hooks/useTitle";

import { ExportButtons } from "../../../components/ExportButtons";
import { useConceptExporter } from "../../../hooks/useConceptExporter";
import { useConcepts } from "../../../hooks/useConcepts";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("concept.title"), t("common.exportTitle"));

  const { mutate: exportConcept, isPending: isExporting, error } = useConceptExporter();

  const { isLoading, concepts } = useConcepts();

  if (isLoading) {
    return <Loading />;
  }

  // Le sélecteur reste monté pendant l'export : démonté, il perdrait la sélection, qu'un
  // échec doit laisser intacte.
  return (
    <>
      {isExporting && <Exporting />}
      <div hidden={isExporting}>
        <Picker
          items={concepts}
          title={t("common.exportTitle")}
          panelTitle={(size) => t("concept.export.panelTitle", { size })}
          availablePanelTitle={(size) => t("concept.export.availablePanelTitle", { size })}
          labelWarning={t("concept.export.hasNot")}
          handleAction={() => {}}
          context="concepts"
          serverSideError={error}
          ValidationButton={({ selectedIds }) => (
            <ExportButtons
              exportHandler={(type, withConcepts, lang = "lg1") =>
                exportConcept({ ids: selectedIds, type, withConcepts, lang })
              }
              disabled={selectedIds.length < 1}
            />
          )}
        />
      </div>
    </>
  );
};
