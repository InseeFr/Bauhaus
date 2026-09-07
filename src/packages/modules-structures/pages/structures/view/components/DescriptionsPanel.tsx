import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { useSecondLang } from "@utils/hooks/second-lang";

interface DescriptionsPanelTypes {
  descriptionLg1: string;
  descriptionLg2: string;
}

export const DescriptionsPanel = ({
  descriptionLg1,
  descriptionLg2,
}: Readonly<DescriptionsPanelTypes>) => {
  const { t } = useTranslation();

  const [secondLang] = useSecondLang();

  return (
    <Row>
      <Note
        title={t("structure.description", { lng: "fr" })}
        text={descriptionLg1}
        alone={!secondLang}
        allowEmpty={true}
      />
      {secondLang && (
        <Note
          title={t("structure.description", { lng: "en" })}
          text={descriptionLg2}
          alone={false}
          allowEmpty={true}
        />
      )}
    </Row>
  );
};
