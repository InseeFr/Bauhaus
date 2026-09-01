import { PublicationFemale, PublicationMale } from "./index";
import { UNPUBLISHED } from "../../model/ValidationState";
import type { ValidationState } from "./index";

interface PublicationStatusItemProps {
  label: string;
  object: { validationState?: ValidationState };
  gender?: "male" | "female";
}

/**
 * Renders a "<label> : <publication status>" list item for the 3-state publication
 * status (Provisoire / Provisoire déjà publié / Publié), picking the masculine or
 * feminine wording via `gender`. Shared across modules (concepts, classifications,
 * operations, datasets, structures, codelists…) to avoid duplicating the rendering.
 */
export const PublicationStatusItem = ({
  label,
  object,
  gender = "male",
}: Readonly<PublicationStatusItemProps>) => {
  const normalized = {
    validationState: object.validationState ?? (UNPUBLISHED as ValidationState),
  };

  return (
    <li>
      {`${label} : `}
      {gender === "female" ? (
        <PublicationFemale object={normalized} />
      ) : (
        <PublicationMale object={normalized} />
      )}
    </li>
  );
};
