import { useEffect, useReducer } from "react";

import { ErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { ConceptForAdvancedSearch } from "../../../types/concept";
import { CollectionApi } from "@sdk/new-collection-api";
import { ConceptsApi } from "@sdk/concepts-api";
import Dashboard from "./home";
import { initialState, reducer } from "./page.reducer";

const emptyItem: ConceptForAdvancedSearch = {
  id: "",
  label: "",
  created: "",
  modified: "",
  disseminationStatus: "",
  validationStatus: "",
  definition: "",
  creator: "",
  isTopConceptOf: "",
  valid: null,
  altLabel: null,
};

export const Component = () => {
  const [{ loading, error, concepts, collections }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([ConceptsApi.getConceptSearchList(), CollectionApi.getCollectionDashboardList()])
      .then(([conceptsList, collectionsList]) => {
        dispatch({
          type: "FETCH_SUCCESS",
          concepts: conceptsList.map((concept: ConceptForAdvancedSearch) => ({
            ...emptyItem,
            ...concept,
          })),
          collections: collectionsList,
        });
      })
      .catch((err: unknown) => dispatch({ type: "FETCH_ERROR", error: err }))
      .finally(() => dispatch({ type: "FETCH_COMPLETE" }));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorBloc error={error} />;

  return <Dashboard conceptsData={concepts} collectionsData={collections} />;
};
