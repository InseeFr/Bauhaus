import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useGoBackOrReplace } from "../../../hooks/useGoBackOrReplace";
import { formatCodelist } from "../../../utils/formatCodelist";
import { CodelistDetailEdit } from "./components/CodelistDetailEdit";

export const Component = () => {
  const { id } = useParams();

  const goBackOrReplace = useGoBackOrReplace();

  const [loading, setLoading] = useState(!!id);

  const [saving, setSaving] = useState(false);

  const [codelist, setCodelist] = useState({});

  const [serverSideError, setServerSideError] = useState("");

  const handleBack = useCallback(() => {
    goBackOrReplace("/codelists", true);
  }, [goBackOrReplace]);

  const handleSave = useCallback(
    (codelist) => {
      setSaving(true);
      setServerSideError("");
      const request = id ? CodelistsApi.putCodelist : CodelistsApi.postCodelist;
      request(codelist)
        .then(() => {
          goBackOrReplace(`/codelists/${codelist.id}`, !!id);
        })
        .catch((error) => {
          setCodelist(codelist);
          setServerSideError(error);
        })
        .finally(() => setSaving(false));
    },
    [goBackOrReplace, id],
  );

  useEffect(() => {
    if (id) {
      CodelistsApi.getDetailedCodelist(id)
        .then((cl) => {
          setCodelist(formatCodelist(cl));
        })
        .catch((error) => setServerSideError(error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (saving) {
    return <Saving />;
  }

  return (
    <CodelistDetailEdit
      col={2}
      codelist={codelist}
      handleBack={handleBack}
      handleSave={handleSave}
      updateMode={id !== undefined}
      serverSideError={serverSideError}
    />
  );
};
