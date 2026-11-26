import { useMemo, useState } from "react";

import { ErrorBloc } from "@components/errors-bloc";
import { PageTitle } from "@components/page-title";

import { CollectionGeneral, CollectionMember, PartialCollection } from "@model/concepts/collection";

import { toFormErrors } from "@utils/api-errors";

import { Menu } from "../menu";
import { validate } from "../validation";
import { CollectionGeneralEdition } from "./CollectionGeneralEdition";
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
  serverSideError?: unknown;
}

// Champs du corps que le back nomme et qui ont une saisie ; l'identifiant n'est saisi qu'en création.
const FIELDS_WITH_ERROR_SLOT = ["id", "creator"];
const FIELDS_WITH_ERROR_SLOT_IN_EDITION = ["creator"];

interface ValidationResult {
  fields: Record<string, string>;
  errorMessage: string[];
}

/** Erreurs de champ du serveur ajoutées aux erreurs client ; un message client non vide l'emporte. */
const withServerFieldErrors = (
  clientErrors: ValidationResult,
  serverFieldErrors: Record<string, string>,
): ValidationResult => {
  const serverMessages = Object.values(serverFieldErrors);
  if (serverMessages.length === 0) return clientErrors;
  const clientFields = Object.fromEntries(
    Object.entries(clientErrors.fields).filter(([, message]) => message),
  );
  return {
    fields: { ...clientErrors.fields, ...serverFieldErrors, ...clientFields },
    errorMessage: [...clientErrors.errorMessage, ...serverMessages],
  };
};

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
  serverSideError,
}: Readonly<CollectionEditionCreationProps>) => {
  const [general, setGeneral] = useState<CollectionGeneral>(() => ({
    ...initialGeneral,
  }));

  // Un 400 de validation : les erreurs des champs affichés vont sous leur saisie, le reste au bandeau.
  const serverErrors = useMemo(
    () =>
      toFormErrors(
        serverSideError,
        creation ? FIELDS_WITH_ERROR_SLOT : FIELDS_WITH_ERROR_SLOT_IN_EDITION,
      ),
    [serverSideError, creation],
  );

  // Erreurs de champ du serveur encore affichées : chacune disparaît quand son champ est modifié,
  // et la liste repart de zéro à chaque nouveau rejet.
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>(
    () => serverErrors.clientSideErrors?.fields ?? {},
  );
  const [lastServerErrors, setLastServerErrors] = useState(serverErrors);
  if (lastServerErrors !== serverErrors) {
    setLastServerErrors(serverErrors);
    setServerFieldErrors(serverErrors.clientSideErrors?.fields ?? {});
  }

  const [members, setMembers] = useState<MemberItem[]>(() => toMemberItems(initialMembers));

  const handleChangeGeneral = (update: Partial<CollectionGeneral>) => {
    setSubmitting(true);
    setGeneral((current) => ({ ...current, ...update }));
    setServerFieldErrors((current) =>
      Object.fromEntries(Object.entries(current).filter(([field]) => !(field in update))),
    );
  };

  const handleChangeMembers = (newMembers: MemberItem[]) => {
    setSubmitting(true);
    setMembers(newMembers);
  };

  const handleSave = () => save({ general, members });

  const redirectCancel = () =>
    creation ? `/concepts/collections` : `/concepts/collections/${initialGeneral.id}`;

  const errors = withServerFieldErrors(
    validate(
      general,
      collectionList.map((c) => ({ id: c.id, label: c.label?.value ?? "" })),
      initialGeneral.prefLabelLg1,
    ),
    serverFieldErrors,
  );

  return (
    <div>
      <div className="container">
        <PageTitle title={title} subtitle={subtitle} />
        <Menu handleSave={handleSave} redirectCancel={redirectCancel} errors={errors} />
        <ErrorBloc error={serverErrors.serverSideError} />
        <CollectionGeneralEdition
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
