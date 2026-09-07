import { useTranslation } from "react-i18next";

import { CheckSecondLang } from "@components/check-second-lang";
import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { Menu } from "../menu";

interface ClassificationItem {
  id: string;
  label: string;
}

type Props = Readonly<{
  items: ClassificationItem[];
  subtitle?: string;
  classificationId: string;
}>;

export const ClassificationItems = ({ items, subtitle, classificationId }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="container">
        <PageTitle title={t("classification.allItemsTitle")} subtitle={subtitle} />
        <Menu />
        <CheckSecondLang />
        {items.length !== 0 && (
          <Row>
            <div className="col-md-8 col-md-offset-2 text-center">
              <SearchableList
                items={items}
                childPath={`classifications/classification/${classificationId}/item`}
              />
            </div>
          </Row>
        )}
      </div>
    </div>
  );
};
