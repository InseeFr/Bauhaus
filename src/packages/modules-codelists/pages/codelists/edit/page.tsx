import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Saving } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useGoBackOrReplace } from "../../../hooks/useGoBackOrReplace";
import { CodeChanges, RefusedCode, saveCodeChanges } from "../../../utils/code-changes";
import { formatCodelist } from "../../../utils/formatCodelist";
import { CodelistDetailEdit } from "./components/CodelistDetailEdit";

export const Component = () => {
  const { id } = useParams();

  const goBackOrReplace = useGoBackOrReplace();

  const [loading, setLoading] = useState(!!id);

  const [saving, setSaving] = useState(false);

  const [codelist, setCodelist] = useState<any>({});

  const [serverSideError, setServerSideError] = useState<unknown>("");

  const [loadError, setLoadError] = useState<unknown>();

  const [codeChanges, setCodeChanges] = useState<CodeChanges>({});

  const [refusedCode, setRefusedCode] = useState<RefusedCode>();

  const handleBack = useCallback(() => {
    goBackOrReplace("/codelists", true);
  }, [goBackOrReplace]);

  const handleSave = useCallback(
    (codelist: any) => {
      setSaving(true);
      setServerSideError("");
      setRefusedCode(undefined);
      const request = id ? CodelistsApi.putCodelist : CodelistsApi.postCodelist;
      request(codelist)
        .then(() =>
          // Chaque code enregistré sort des modifications en attente : en cas d'échec, seules
          // celles qui restent seront renvoyées à la sauvegarde suivante.
          saveCodeChanges(codelist.id, codeChanges, (code) =>
            setCodeChanges(({ [code]: _saved, ...others }) => others),
          ),
        )
        .then(() => {
          goBackOrReplace(`/codelists/${codelist.id}`, !!id);
        })
        .catch((error: unknown) => {
          setCodelist(codelist);
          // Un code refusé se corrige dans son panneau : il y est rouvert avec son erreur.
          if (error instanceof RefusedCode) {
            setRefusedCode(error);
          } else {
            setServerSideError(error);
          }
        })
        .finally(() => setSaving(false));
    },
    [goBackOrReplace, id, codeChanges],
  );

  useEffect(() => {
    if (id) {
      CodelistsApi.getDetailedCodelist(id)
        .then((cl: any) => {
          setCodelist(formatCodelist(cl));
        })
        .catch(setLoadError)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loadError) {
    return <LoadingErrorBloc error={loadError} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (saving) {
    return <Saving />;
  }

  return (
    <CodelistDetailEdit
      codelist={codelist}
      handleBack={handleBack}
      handleSave={handleSave}
      updateMode={id !== undefined}
      serverSideError={serverSideError}
      codeChanges={codeChanges}
      onCodeChangesChange={setCodeChanges}
      refusedCode={refusedCode}
    />
  );
};
