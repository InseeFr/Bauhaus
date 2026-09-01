import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PickList } from "primereact/picklist";

import "../../../../i18n";

interface ConceptItem {
  id: string;
  label: string;
}

const notMembers = (conceptList: ConceptItem[], members: ConceptItem[]): ConceptItem[] => {
  const memberIds = new Set(members.map(({ id }) => id));

  return conceptList.filter(({ id }) => !memberIds.has(id));
};

interface CollectionMembersEditionProps {
  conceptList: ConceptItem[];
  members: ConceptItem[];
  handleChange: (members: ConceptItem[]) => void;
}

export const CollectionMembersEdition = ({
  conceptList,
  members,
  handleChange,
}: Readonly<CollectionMembersEditionProps>) => {
  const { t } = useTranslation();

  const [availableConcepts, setAvailableConcepts] = useState<ConceptItem[]>(() =>
    notMembers(conceptList, members),
  );

  const [selectedConcepts, setSelectedConcepts] = useState<ConceptItem[]>(() => members);

  return (
    <PickList
      dataKey="id"
      source={availableConcepts}
      target={selectedConcepts}
      onChange={(event) => {
        // PrimeReact type les deux listes en `any` : on rétablit le type au passage.
        const available = event.source as ConceptItem[];
        const selected = event.target as ConceptItem[];
        setAvailableConcepts(available);
        setSelectedConcepts(selected);
        handleChange(selected);
      }}
      itemTemplate={(concept: ConceptItem) => concept.label}
      sourceHeader={t("collection.availableConceptsPanelTitle", {
        size: availableConcepts.length,
      })}
      targetHeader={t("collection.membersPanelTitle", {
        size: selectedConcepts.length,
      })}
      filter
      filterBy="label"
      sourceFilterPlaceholder={t("common.searchLabelPlaceholder")}
      targetFilterPlaceholder={t("common.searchLabelPlaceholder")}
      showSourceControls={false}
      showTargetControls={false}
      sourceStyle={{ height: "20rem" }}
      targetStyle={{ height: "20rem" }}
    />
  );
};
