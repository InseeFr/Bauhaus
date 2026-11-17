import Editor from "@uiw/react-md-editor/nohighlight";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Row } from "@components/layout";
import { Note } from "@components/note";
import { List } from "@components/ui/list";

import { WasDerivedFrom } from "@model/Dataset";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useDatasets } from "../../../../hooks/useDatasets";

type Source = { id: string; label: string };

const getSourceKey = ({ id }: Source) => id;

const getSourceLink = ({ id, label }: Source) => <Link to={`/datasets/${id}`}>{label}</Link>;

export const LineageBlock = ({ wasDerivedFrom }: Readonly<{ wasDerivedFrom?: WasDerivedFrom }>) => {
  const { t } = useTranslation();
  const [secondLang] = useSecondLang();
  const { data: datasets = [] } = useDatasets();

  if (!wasDerivedFrom?.datasets?.length) {
    return null;
  }

  const sources: Source[] = wasDerivedFrom.datasets.map((id) => ({
    id,
    label: datasets.find((dataset) => dataset.id === id)?.label ?? id,
  }));

  return (
    <>
      <Row>
        <Note
          text={<List items={sources} getContent={getSourceLink} getKey={getSourceKey} />}
          title={t("dataset.lineage.sources")}
          alone={true}
        />
      </Row>
      <Row>
        <Note
          text={<Editor.Markdown source={wasDerivedFrom.descriptionLg1} />}
          title={t("dataset.lineage.description", { lng: "fr" })}
          alone={!secondLang}
          allowEmpty={true}
        />
        {secondLang && (
          <Note
            text={<Editor.Markdown source={wasDerivedFrom.descriptionLg2} />}
            title={t("dataset.lineage.description", { lng: "en" })}
            alone={false}
            allowEmpty={true}
          />
        )}
      </Row>
    </>
  );
};
