import { useTranslation } from "react-i18next";

import { PublishButton } from "@components/buttons/buttons-with-icons";
import { Picker } from "@components/picker-page";

import { UnpublishedCollection } from "@model/concepts/collection";

interface CollectionsToValidateProps {
  collections: UnpublishedCollection[];
  handleValidateCollectionList: (ids: string[]) => void;
  serverSideError?: string;
}

export const CollectionsToValidate = ({
  collections,
  handleValidateCollectionList,
  serverSideError,
}: Readonly<CollectionsToValidateProps>) => {
  const { t } = useTranslation();
  return (
    <Picker
      items={collections}
      title={t("collection.validation.title")}
      panelTitle={(size) => t("collection.validation.panelTitle", { size })}
      availablePanelTitle={(size) => t("collection.validation.availablePanelTitle", { size })}
      labelWarning={t("collection.validation.hasNot")}
      ValidationButton={({ action, disabled }) => (
        <PublishButton action={action} disabled={disabled} />
      )}
      handleAction={handleValidateCollectionList}
      serverSideError={serverSideError}
      context="concepts/collections"
    />
  );
};
