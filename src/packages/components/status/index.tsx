import { useTranslation } from "react-i18next";

import { MODIFIED, UNPUBLISHED, VALIDATED } from "@model/ValidationState";

import { appI18n } from "../../i18n";

export type ValidationState = typeof MODIFIED | typeof UNPUBLISHED | typeof VALIDATED;

interface PublicationType {
  object: {
    validationState: ValidationState;
  };
}

export function PublicationMale({ object }: Readonly<PublicationType>) {
  return <PublicationStatus object={object} />;
}

export function PublicationFemale({ object }: Readonly<PublicationType>) {
  const { t } = useTranslation("translation", { i18n: appI18n });

  return (
    <PublicationStatus
      object={object}
      dictionary={{
        Validated: t("validationState.validated.f"),
        Unpublished: t("validationState.unpublished.f"),
        Modified: t("validationState.modified.f"),
      }}
    />
  );
}

type PublicationStatusType = {
  dictionary?: Record<ValidationState, string>;
} & PublicationType;

function PublicationStatus({
  dictionary,
  object: { validationState = UNPUBLISHED },
}: Readonly<PublicationStatusType>) {
  const { t } = useTranslation("translation", { i18n: appI18n });

  const resolvedDictionary = dictionary ?? {
    Validated: t("validationState.validated.m"),
    Unpublished: t("validationState.unpublished.m"),
    Modified: t("validationState.modified.m"),
  };

  return resolvedDictionary[validationState];
}
