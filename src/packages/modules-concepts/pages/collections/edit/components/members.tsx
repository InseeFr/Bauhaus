import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { Column, Row } from "@components/layout";
import { AddLogo } from "@components/logo/logo-add";
import { DelLogo } from "@components/logo/logo-del";
import { Pagination } from "@components/pagination";
import { Panel } from "@components/panel";
import { PickerItem } from "@components/picker-item";

import { arrayDifferenceByID, filterDeburr } from "@utils/array-utils";

import MainDictonary from "../../../../../deprecated-locales";
import "../../../../i18n";

interface ConceptItem {
  id: string;
  label: string;
}

interface TrackedConcept extends ConceptItem {
  isAdded: boolean;
}

const extractMembers = (concepts: TrackedConcept[]): ConceptItem[] =>
  concepts.reduce<ConceptItem[]>((members, { id, label, isAdded }) => {
    if (isAdded) members.push({ id, label });
    return members;
  }, []);

const trackPotentialsConcepts = (
  conceptList: ConceptItem[],
  memberList: ConceptItem[],
): TrackedConcept[] => {
  const potentialList = arrayDifferenceByID(
    conceptList as unknown as { id: number }[],
    memberList as unknown as { id: number }[],
  ) as unknown as ConceptItem[];
  return potentialList.map(({ id, label }) => ({ id, label, isAdded: false }));
};

const trackMembers = (memberList: ConceptItem[]): TrackedConcept[] =>
  memberList.map(({ id, label }) => ({ id, label, isAdded: true }));

const trackConcepts = (
  potentialList: TrackedConcept[],
  memberList: TrackedConcept[],
): TrackedConcept[] => potentialList.concat(memberList);

interface CollectionMembersEditionProps {
  conceptList: ConceptItem[];
  members: ConceptItem[];
  handleChange: (members: ConceptItem[]) => void;
}

const CollectionMembersEdition = ({
  conceptList,
  members,
  handleChange,
}: Readonly<CollectionMembersEditionProps>) => {
  const { t } = useTranslation();
  const [searchLabel, setSearchLabel] = useState("");
  const [concepts, setConcepts] = useState<TrackedConcept[]>(() =>
    trackConcepts(trackPotentialsConcepts(conceptList, members), trackMembers(members)),
  );

  const addConcept = (id: string) => {
    const conceptsToAdd = concepts.map((concept) =>
      concept.id === id ? { ...concept, isAdded: true } : concept,
    );
    setConcepts(conceptsToAdd);
    handleChange(extractMembers(conceptsToAdd));
  };

  const removeConcept = (id: string) => {
    const conceptsToDel = concepts.map((concept) =>
      concept.id === id ? { ...concept, isAdded: false } : concept,
    );
    setConcepts(conceptsToDel);
    handleChange(extractMembers(conceptsToDel));
  };

  const getConceptsByStatus = () => {
    const check = filterDeburr(searchLabel);
    return concepts.reduce<{ toAdd: ConceptItem[]; added: ConceptItem[] }>(
      (byStatus, { id, label, isAdded }) => {
        if (isAdded) byStatus.added.push({ id, label });
        else if (check(label)) byStatus.toAdd.push({ id, label });
        return byStatus;
      },
      { toAdd: [], added: [] },
    );
  };

  const { toAdd, added } = getConceptsByStatus();

  const toAddEls = toAdd.map(({ id, label }) => (
    <PickerItem key={id} id={id} label={label} logo={<AddLogo />} handleClick={addConcept} />
  ));

  const addedEls = added.map(({ id, label }) => (
    <PickerItem key={id} id={id} label={label} logo={<DelLogo />} handleClick={removeConcept} />
  ));

  return (
    <Row>
      <Column>
        <Panel title={t("collection.membersPanelTitle", { size: addedEls.length })}>
          {addedEls}
        </Panel>
      </Column>
      <Column>
        <TextInput
          value={searchLabel}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchLabel(e.target.value)}
          placeholder={MainDictonary.searchLabelPlaceholder}
        />
        <Pagination itemEls={toAddEls} />
      </Column>
    </Row>
  );
};

export default CollectionMembersEdition;
