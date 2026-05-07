import { Note } from "@components/note";

import { D1 } from "../../i18n/build-dictionary";

const labelOf = (item) => item?.labelLg1 ?? item?.label ?? "";

const toPublishersArray = (publishers) => {
  if (Array.isArray(publishers)) return publishers;
  if (publishers) return [publishers];
  return [];
};

const PublishersView = ({ publishers, lg1 }) => {
  const publishersArray = toPublishersArray(publishers);

  return (
    <Note
      text={
        publishersArray.length === 1 ? (
          <p>{labelOf(publishersArray[0])}</p>
        ) : (
          <ul>
            {publishersArray.map((item, index) => (
              <li key={item?.id ?? index}>{labelOf(item)}</li>
            ))}
          </ul>
        )
      }
      title={D1.organisation}
      lang={lg1}
      alone={true}
      allowEmpty={true}
    />
  );
};

export default PublishersView;
