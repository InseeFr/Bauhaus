import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { ClassificationsApi } from "@sdk/classification";

import { useSecondLang } from "@utils/hooks/second-lang";

import HomeAssociations from "./home-associations";
import HomeGeneral from "./home-general";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const { data: correspondence, isLoading } = useQuery({
    queryKey: ["correspondance-general", id],
    queryFn: () => ClassificationsApi.getCorrespondenceGeneral(id),
  });
  const { data: associations } = useQuery({
    queryKey: ["correspondance-associations", id],
    queryFn: () => ClassificationsApi.getCorrespondenceAssociations(id),
  });

  const [secondLang] = useSecondLang();

  if (isLoading) return <Loading />;

  return (
    <div className="container">
      <HomeGeneral correspondence={correspondence} secondLang={secondLang} />
      {!associations ? (
        <Loading />
      ) : (
        <HomeAssociations
          id={id}
          associations={associations}
          correspondence={correspondence}
          secondLang={secondLang}
        />
      )}
    </div>
  );
};
