import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Publishing } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { ComponentTitle } from "../../../components/ComponentTitle";
import { formatCodelist } from "../../../utils/formatCodelist";
import { CodelistDetailView } from "./components/CodelistDetailView";

export const Component = () => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [publishing, setPublishing] = useState(false);

  const [codelist, setCodelist] = useState<any>({});

  const [modalOpened, setModalOpened] = useState(false);

  const [serverSideError, setServerSideError] = useState<unknown>("");

  const handleBack = useCallback(() => goBack("/codelists"), [goBack]);

  const publish = () => {
    setPublishing(true);
    CodelistsApi.publishCodelist(id)
      .then(() => {
        return CodelistsApi.getDetailedCodelist(id).then((cl: any) => {
          setCodelist(formatCodelist(cl));
        });
      })
      .catch((error: unknown) => {
        setServerSideError(error);
      })
      .finally(() => setPublishing(false));
  };

  const handleDelete = useCallback(() => {
    setLoading(true);
    CodelistsApi.deleteCodelist(id)
      .then(() => {
        setLoading(false);
        setModalOpened(false);
        goBack("/codelists");
      })
      .catch((error: unknown) => {
        setServerSideError(error);
        setLoading(false);
        setModalOpened(false);
      });
  }, [id, goBack]);

  useEffect(() => {
    CodelistsApi.getDetailedCodelist(id)
      .then((cl: any) => {
        setCodelist(formatCodelist(cl));
      })
      .catch((error: unknown) => setServerSideError(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (publishing) return <Publishing />;

  return (
    <>
      <ComponentTitle component={codelist} />
      <CodelistDetailView
        codelist={codelist}
        handleBack={handleBack}
        handleUpdate={`/codelists/${codelist.id}/modify`}
        handleDelete={() => setModalOpened(true)}
        deletable
        modalOpened={modalOpened}
        handleYes={handleDelete}
        handleNo={() => setModalOpened(false)}
        secondLang={secondLang}
        updatable={true}
        serverSideError={serverSideError}
        publishComponent={publish}
      />
    </>
  );
};
