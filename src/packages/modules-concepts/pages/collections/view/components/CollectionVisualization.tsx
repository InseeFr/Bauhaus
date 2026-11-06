import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { ErrorBloc } from "@components/errors-bloc";
import { Exporting } from "@components/loading";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import { CollectionGeneral, CollectionMember } from "@model/concepts/collection";

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import { Menu } from "../menu";
import { CollectionGeneral as CollectionGeneralComponent } from "./CollectionGeneral";
import { CollectionMembers } from "./CollectionMembers";

interface CollectionVisualizationProps {
  id: string;
  general: CollectionGeneral;
  members: CollectionMember[];
  secondLang: boolean;
  validateCollection: (id: string) => void;
  /** Rejet de la dernière publication, rendu par `ErrorBloc`. */
  validationError?: unknown;
}

export const CollectionVisualization = ({
  id,
  general,
  members,
  secondLang,
  validateCollection,
  validationError,
}: Readonly<CollectionVisualizationProps>) => {
  const { t } = useTranslation();

  useTitle(t("collection.title"), general.prefLabelLg1);

  const { validationState } = general;

  const {
    mutate: exportCollection,
    isPending: isExporting,
    error: exportError,
  } = useCollectionExporter();

  const handleClickValid = () => {
    validateCollection(id);
  };

  if (isExporting) return <Exporting />;

  return (
    <div>
      <div className="container">
        <PageTitle title={general.prefLabelLg1} />
        {secondLang && general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
        <Menu
          id={id}
          validationState={validationState}
          handleValidation={handleClickValid}
          exportCollection={exportCollection}
        />
        <ErrorBloc error={validationError} />
        <ErrorBloc error={exportError} />
        <CheckSecondLang />
        <CollectionGeneralComponent attr={general} secondLang={secondLang} />
        <CollectionMembers members={members} secondLang={secondLang} />
      </div>
    </div>
  );
};
