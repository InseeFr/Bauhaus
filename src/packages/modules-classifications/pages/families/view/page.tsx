import { QueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { LoaderFunctionArgs, useParams } from "react-router";

import { useSecondLang } from "@utils/hooks/second-lang";

import { appQueryClient } from "../../../../application/query-client";
import { familyGeneralQuery, familyMembersQuery } from "../../../hooks/useClassificationFamily";
import { FamilyVisualization } from "./components/FamilyVisualization";

/**
 * Lance la lecture de la famille pendant le téléchargement de la page, sans l'attendre : la
 * navigation n'est pas retenue, la page suspend ensuite sur les mêmes requêtes et un échec
 * s'affiche dans l'encart d'erreur du module.
 */
export const prefetchFamily =
  (queryClient: QueryClient) =>
  ({ params }: LoaderFunctionArgs) => {
    const id = params.id!;
    void queryClient.prefetchQuery(familyGeneralQuery(id));
    void queryClient.prefetchQuery(familyMembersQuery(id));
    return null;
  };

export const loader = prefetchFamily(appQueryClient);

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [secondLang] = useSecondLang();

  const [{ data: general }, { data: members }] = useSuspenseQueries({
    queries: [familyGeneralQuery(id!), familyMembersQuery(id!)],
  });

  return <FamilyVisualization family={{ general, members }} secondLang={secondLang} />;
};
