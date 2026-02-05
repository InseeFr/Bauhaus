import { Link } from "react-router-dom";

import { Link as LinkType } from "@model/concepts/concept";

import { sortArray } from "@utils/array-utils";

export const InternalLinks = ({
  links,
  title,
  labelProperty,
}: Readonly<{
  links: LinkType[];
  title: string;
  labelProperty: string;
}>) => {
  return (
    links.length > 0 && (
      <>
        <dt>{title}</dt>
        {sortArray(labelProperty)(links).map((link) => (
          <dd key={link.id}>
            <Link to={"/concepts/" + link.id}>{link[labelProperty]}</Link>
          </dd>
        ))}
      </>
    )
  );
};
