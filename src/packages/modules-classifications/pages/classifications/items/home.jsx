import { CheckSecondLang } from "@components/check-second-lang";
import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import D from "../../../../deprecated-locales";
import { Menu as Controls } from "./menu";

const ClassificationTree = ({ items, subtitle, classificationId }) => {
  return (
    <div>
      <div className="container">
        <PageTitle title={D.classificationAllItemsTitle} subtitle={subtitle} />
        <Controls />
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

export default ClassificationTree;
