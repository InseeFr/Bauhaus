import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Link } from "@components/link";
import { Note } from "@components/note";
import { List } from "@components/ui/list";

import { PartialCollection } from "@model/concepts/collection";

import { useCollections } from "../../../../hooks/useCollections";

export const CollectionsBlock = ({
  collectionsIds = [],
}: Readonly<{
  collectionsIds?: string[];
}>) => {
  const { data } = useCollections();

  const { t } = useTranslation();

  const collectionsMap = useMemo(() => new Map((data ?? []).map((c) => [c.id, c])), [data]);

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
