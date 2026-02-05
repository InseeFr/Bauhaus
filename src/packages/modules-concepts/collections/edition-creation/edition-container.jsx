import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";
import { cleanId } from "@utils/string-utils";

import D from "../../../deprecated-locales";
import buildPayload from "../utils/build-payload/build-payload";
import CollectionEditionCreation from "./home";
import { useCollections } from "../../hooks/useCollections";
import { useCollection } from "../../hooks/useCollection";
import { useQueryClient } from "@tanstack/react-query";

export const Component = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [loadingExtraData, setLoadingExtraData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: collection, isLoading: loadingCollection } = useCollection(id);
  const { data: collectionList } = useCollections();
  const [conceptList, setConceptList] = useState([]);

  useEffect(() => {
    ConceptsApi.getConceptList()
      .then((conceptsList) => {
        setConceptList(conceptsList);
      })
      .finally(() => setLoadingExtraData(false));
  }, []);

  const handleUpdate = useCallback(
    (data) => {
      setSaving(true);
      ConceptsApi.putCollection(data.general.id, buildPayload(data, "UPDATE"))
        .then(() => {
          queryClient.invalidateQueries(["collection", id]);
          queryClient.invalidateQueries(["collections"]);
          navigate(`/concepts/collections/${cleanId(id)}`);
        })
        .finally(() => setSaving(false));
    },
    [navigate, id],
  );

  const { general, members } = collection || {};
  useTitle(D.collectionsTitle, general?.prefLabelLg1);

  if (saving) {
    return <Saving />;
  }
  if (loadingCollection || loadingExtraData) {
    return <Loading />;
  }

  return (
    <CollectionEditionCreation
      title={D.updateCollectionTitle}
      subtitle={general.prefLabelLg1}
      general={general}
      members={members}
      collectionList={collectionList}
      conceptList={conceptList}
      save={handleUpdate}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
