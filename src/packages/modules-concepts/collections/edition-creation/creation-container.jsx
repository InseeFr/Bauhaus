import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { useAppContext } from "../../../application/app-context";
import D from "../../../deprecated-locales";
import emptyCollection from "../../collections/utils/empty-collection";
import buildPayload from "../utils/build-payload/build-payload";
import CollectionEditionCreation from "./home";
import { useCollections } from "../../hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";

export const Component = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    properties: { defaultContributor },
  } = useAppContext();
  const collection = emptyCollection(defaultContributor);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [conceptList, setConceptList] = useState([]);
  const { data: collectionList } = useCollections();

  useEffect(() => {
    ConceptsApi.getConceptList()
      .then((conceptsList) => {
        setConceptList(conceptsList);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreation = useCallback(
    (data) => {
      setSaving(true);
      ConceptsApi.postCollection(buildPayload(data, "CREATE"))
        .then((id) => {
          queryClient.invalidateQueries(["collections"]);
          navigate(`/concepts/collections/${id}`);
        })
        .finally(() => setSaving(false));
    },
    [navigate],
  );

  const { general, members } = collection;
  useTitle(D.collectionsTitle, general?.prefLabelLg1);

  if (saving) {
    return <Saving />;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <CollectionEditionCreation
      title={D.createCollectionTitle}
      general={general}
      members={members}
      collectionList={collectionList}
      conceptList={conceptList}
      save={handleCreation}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
