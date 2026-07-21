import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../../deprecated-locales";

export const CorrespondencesHome = ({ correspondences }: { correspondences: any }) => {
  useTitle(D.classificationsTitle, D.correspondencesTitle);

  return (
    <div className="container">
      <Row>
        <div className="col-md-8 col-md-offset-2 text-center">
          <PageTitle title={D.correspondencesSearchTitle} col={12} offset={0} />
          <SearchableList
            items={correspondences}
            childPath="classifications/correspondence"
            autoFocus
          />
        </div>
      </Row>
    </div>
  );
};
