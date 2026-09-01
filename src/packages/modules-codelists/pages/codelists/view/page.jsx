import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Publishing } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { CodelistsApi } from "@sdk/index";
import { formatCodelist } from "../../../utils/formatCodelist";
import { ComponentTitle } from "../../../components/ComponentTitle";
import { CodelistDetailView } from "./components/CodelistDetailView";

export const Component = (props) => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [publishing, setPublishing] = useState(false);

  const [codelist, setCodelist] = useState({});

  const [modalOpened, setModalOpened] = useState(false);

  const [serverSideError, setServerSideError] = useState("");

  const handleBack = useCallback(() => goBack("/codelists"), [goBack]);

  const publish = () => {
    setPublishing(true);
    CodelistsApi.publishCodelist(id)
      .then(() => {
        return CodelistsApi.getDetailedCodelist(id).then((cl) => {
          setCodelist(formatCodelist(cl));
        });
      })
      .catch((error) => {
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
      .catch((error) => {
        setServerSideError(error);
        setLoading(false);
        setModalOpened(false);
      });
  }, [id, goBack]);

  useEffect(() => {
    CodelistsApi.getDetailedCodelist(id)
      .then((cl) => {
        setCodelist(formatCodelist(cl));
      })
      .catch((error) => setServerSideError(error))
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
        {...props}
        col={2}
        codelist={codelist}
        handleBack={handleBack}
        handleUpdate={`/codelists/${codelist.id}/modify`}
        handleDelete={() => setModalOpened(true)}
        deletable
        modalOpened={modalOpened}
        handleYes={handleDelete}
        handleNo={() => setModalOpened(false)}
        secondLang={secondLang}
        mutualized={true}
        updatable={true}
        serverSideError={serverSideError}
        publishComponent={publish}
      />
    </>
  );
};
