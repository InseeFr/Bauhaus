import { Link } from "react-router-dom";

import { List } from "@components/ui/list";

import { useOperations } from "@utils/hooks/operations";
import { useSeries } from "@utils/hooks/series";

import { Operation } from "../../../../model/Operation";
import { Series } from "../../../../model/Series";
import { EMPTY_ARRAY } from "@utils/array-utils";

interface WasGeneratedByBlockTypes {
  iris: string[];
}

const generateGenericWasGeneratedBy = (
  basePath: string,
  datas: (Operation | Series)[],
  iris: string[],
): { label: string; url: string }[] => {
  return iris
    .map((wasGeneratedIRI) => {
      return datas.find(({ iri }) => iri === wasGeneratedIRI);
    })
    .filter((data) => !!data)
    .map((data) => {
      return {
        label: data.label,
        url: `${basePath}/${data.id}`,
      };
    });
};

export const WasGeneratedByBlock = ({ iris = EMPTY_ARRAY }: WasGeneratedByBlockTypes) => {
  const { data: series = [], isLoading: isSeriesLoading } = useSeries();
  const { data: operations = [], isLoading: isOperationsLoading } = useOperations();

  if (isSeriesLoading || isOperationsLoading) {
    return <></>;
  }

  const wasGeneratedBys = [
    ...generateGenericWasGeneratedBy("/operations/series", series, iris),
    ...generateGenericWasGeneratedBy("/operations/operation", operations, iris),
  ];

  if (wasGeneratedBys.length === 0) {
    return <></>;
  }

  return (
    <List
      items={wasGeneratedBys}
      getContent={({ url, label }) => <Link to={url}>{label}</Link>}
      getKey={({ url }) => url}
    ></List>
  );
};
