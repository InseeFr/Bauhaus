import { ExternalLink } from "@components/link";

import { Link } from "@model/concepts/concept";

export const CloseMatchLinks = ({
  links,
  Dictionary,
}: Readonly<{ links: Link[]; Dictionary: Record<string, string> }>) => {
  return (
    links.length > 0 && (
      <li>
        {Dictionary.equivalentTitle} :
        <ul>
          {links.map((cm) => (
            <li key={cm.urn}>
              <ExternalLink href={cm.urn}>{cm.urn}</ExternalLink>
            </li>
          ))}
        </ul>
      </li>
    )
  );
};
