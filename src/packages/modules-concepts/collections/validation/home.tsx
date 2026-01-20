import { PublishButton } from "@components/buttons/buttons-with-icons";
import { Picker } from "@components/picker-page";

import { UnpublishedCollection } from "@model/concepts/collection";

import D from "../../../deprecated-locales";

interface CollectionsToValidateProps {
  collections: UnpublishedCollection[];
  handleValidateCollectionList: (ids: string[]) => void;
}

const CollectionsToValidate = ({
  collections,
  handleValidateCollectionList,
}: Readonly<CollectionsToValidateProps>) => {
  return (
    <Picker
      items={collections}
      title={D.collectionsToValidTitle}
      panelTitle={D.collectionsToValidPanelTitle}
      labelWarning={D.hasNotCollectionToValid}
      ValidationButton={PublishButton}
      handleAction={handleValidateCollectionList}
      context="collections"
    />
  );
};

export default CollectionsToValidate;
