import { useMemo } from "react";
import { Row } from "@components/layout";
import { Note } from "@components/note";
import { useCollections } from "../../../../hooks/useCollections";
import { List } from "@components/ui/list";
import { Link } from "@components/link";
import { useTranslation } from "@utils/hooks/useTranslation";
import { PartialCollection } from "@model/concepts/collection";

export const CollectionsBlock = ({
  collectionsIds = [],
}: Readonly<{
  collectionsIds?: string[];
}>) => {
  const { data } = useCollections();
  const { t } = useTranslation();

  const collectionsMap = useMemo(() => new Map(data.map((c) => [c.id, c])), [data]);

  const collections = collectionsIds
    .map((id) => collectionsMap.get(id))
    .filter((c): c is PartialCollection => c !== undefined);

  if (collections.length === 0) return null;

  return (
    <Row>
      <Note
        alone={true}
        title={t("concept.general.collectionsListTitle", {
          size: collections.length,
        })}
        text={
          <List
            items={collections}
            getContent={(c) => <Link to={"/concepts/collections/" + c.id}>{c.label.value}</Link>}
          />
        }
      />
    </Row>
  );
};
