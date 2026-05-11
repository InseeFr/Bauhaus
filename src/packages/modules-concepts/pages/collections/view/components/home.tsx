import { CheckSecondLang } from "@components/check-second-lang";
import { Exporting } from "@components/loading";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import { useCollectionExporter } from "@utils/hooks/collections";
import { useTitle } from "@utils/hooks/useTitle";

import { CollectionGeneral, CollectionMember } from "@model/concepts/collection";

import D from "../../../../../deprecated-locales";
import { Menu } from "../menu";
import CollectionGeneralView from "./general";
import CollectionMembers from "./members";

interface CollectionVisualizationProps {
  id: string;
  general: CollectionGeneral;
  members: CollectionMember[];
  secondLang: boolean;
  validateCollection: (id: string) => void;
}

const CollectionVisualization = ({
  id,
  general,
  members,
  secondLang,
  validateCollection,
}: Readonly<CollectionVisualizationProps>) => {
  useTitle(D.collectionsTitle, general.prefLabelLg1);

  const { isValidated } = general;
  const { mutate: exportCollection, isPending: isExporting } = useCollectionExporter();
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
          isValidated={Boolean(isValidated)}
          handleValidation={handleClickValid}
          exportCollection={exportCollection}
        />
        <CheckSecondLang />
        <CollectionGeneralView attr={general} secondLang={secondLang} />
        <CollectionMembers members={members} secondLang={secondLang} />
      </div>
    </div>
  );
};

export default CollectionVisualization;
