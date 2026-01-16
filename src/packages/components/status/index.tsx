import D from "../../i18n";
import { MODIFIED, UNPUBLISHED, VALIDATED } from "../../model/ValidationState";

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
  return (
    <PublicationStatus
      object={object}
      dictionary={{
        Validated: D.validationState.validated.f,
        Unpublished: D.validationState.unpublished.f,
        Modified: D.validationState.modified.f,
      }}
    />
  );
}

type PublicationStatusType = {
  dictionary?: Record<ValidationState, string>;
} & PublicationType;

function PublicationStatus({
  dictionary = {
    Validated: D.validationState.validated.m,
    Unpublished: D.validationState.unpublished.m,
    Modified: D.validationState.modified.m,
  },
  object: { validationState = UNPUBLISHED },
}: Readonly<PublicationStatusType>) {
  const status = dictionary[validationState];
  return <>{status}</>;
}
