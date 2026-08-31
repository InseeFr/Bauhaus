import { useState } from "react";

import { PageTitle } from "@components/page-title";

import { CollectionGeneral, CollectionMember, PartialCollection } from "@model/concepts/collection";

import { Menu } from "../menu";
import { validate } from "../validation";
import { CollectionGeneralEdition as GeneralEdition } from "./CollectionGeneralEdition";
import { CollectionMembersEdition } from "./CollectionMembersEdition";

interface MemberItem {
  id: string;
  label: string;
}

interface CollectionEditionCreationProps {
  title: string;
  subtitle?: string;
  creation?: boolean;
  general: CollectionGeneral;
  members: CollectionMember[];
  collectionList: PartialCollection[];
  conceptList: { id: string; label: string }[];
  save: (data: { general: CollectionGeneral; members: MemberItem[] }) => void;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

const toMemberItems = (members: CollectionMember[]): MemberItem[] =>
  members.map(({ id, prefLabelLg1 }) => ({ id, label: prefLabelLg1 }));

export const CollectionEditionCreation = ({
  title,
  subtitle,
  creation,
  general: initialGeneral,
  members: initialMembers,
  collectionList,
  conceptList,
  save,
  setSubmitting,
}: Readonly<CollectionEditionCreationProps>) => {
  const [general, setGeneral] = useState<CollectionGeneral>(() => ({ ...initialGeneral }));
  const [members, setMembers] = useState<MemberItem[]>(() => toMemberItems(initialMembers));

  const handleChangeGeneral = (update: Partial<CollectionGeneral>) => {
    setSubmitting(true);
    setGeneral((current) => ({ ...current, ...update }));
  };

  const handleChangeMembers = (newMembers: MemberItem[]) => {
    setSubmitting(true);
    setMembers(newMembers);
  };

  const handleSave = () => save({ general, members });

  const redirectCancel = () =>
    creation ? `/concepts/collections` : `/concepts/collections/${initialGeneral.id}`;

  const errors = validate(
    general,
    collectionList.map((c) => ({ id: c.id, label: c.label?.value ?? "" })),
    initialGeneral.id,
    initialGeneral.prefLabelLg1,
  );

  return (
    <div>
      <div className="container">
        <PageTitle title={title} subtitle={subtitle} />
        <Menu handleSave={handleSave} redirectCancel={redirectCancel} errors={errors} />
        <GeneralEdition
          general={general}
          handleChange={handleChangeGeneral}
          errors={errors}
          creation={creation}
        />
        <CollectionMembersEdition
          members={members}
          conceptList={conceptList}
          handleChange={handleChangeMembers}
        />
      </div>
    </div>
  );
};
