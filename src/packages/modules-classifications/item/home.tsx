import { CheckSecondLang } from "@components/check-second-lang";
import { PageSubtitle } from "@components/page-sub-title";
import { PageTitle } from "@components/page-title";

import Controls from "./controls";
import General from "./general";
import Narrowers from "./narrowers";
import Notes from "./notes";

const ItemVisualization = ({ item: { general, notes, narrowers }, secondLang }) => {
  const { classificationId, itemId, conceptVersion: version } = general;
  return (
    <div className="container">
      <PageTitle title={general.prefLabelLg1} />
      {secondLang && general.prefLabelLg2 && <PageSubtitle subTitle={general.prefLabelLg2} />}
      <Controls classificationId={classificationId} itemId={itemId} version={version} />
      <CheckSecondLang />
      <General
        general={general}
        classificationId={classificationId}
        itemId={itemId}
        secondLang={secondLang}
      />
      {notes && <Notes secondLang={secondLang} notes={notes} />}

      <Narrowers
        narrowers={narrowers}
        classificationId={classificationId}
        secondLang={secondLang}
      />
    </div>
  );
};

export default ItemVisualization;
