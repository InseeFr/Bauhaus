import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Deleting, Publishing, Loading } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { ComponentTitle } from "../../../components/ComponentTitle";
import { formatPartialCodelist } from "../../../utils/formatPartialCodelist";
import { PartialCodelistDetailView } from "./components/PartialCodelistDetailView";

export const Component = (props) => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams();

  const [deleting, setDeleting] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [codelists, setCodelists] = useState([]);

  const [modalOpened, setModalOpened] = useState(false);

  const [serverSideError, setServerSideError] = useState("");

  const {
    data: codelist = {},
    isLoading,
    refetch,
    error: loadingError,
  } = useQuery({
    queryKey: ["partial-code-list", id],
    enabled: codelists.length > 0,
    queryFn: () => {
      return CodelistsApi.getCodelistPartial(id).then((cl) => {
        const idParent = codelists.find((codelist) => codelist.uri === cl.iriParent)?.id;
        if (!idParent) {
          return;
        }
        return CodelistsApi.getCodelistCodes(idParent, 1, 0).then((codes) => {
          return formatPartialCodelist(cl, codes.items);
        });
      });
    },
  });

  const publish = () => {
    setPublishing(true);
    CodelistsApi.publishPartialCodelist(id)
      .then(() => {
        return refetch();
      })
      .catch((error) => {
        setServerSideError(error);
      })
      .finally(() => setPublishing(false));
  };

  const handleDelete = () => {
    setDeleting(true);
    CodelistsApi.deleteCodelistPartial(id)
      .then(() => {
        goBack("/codelists");
      })
      .catch((error) => {
        setServerSideError(error);
      })
      .finally(() => {
        setDeleting(false);
        setModalOpened(false);
      });
  };

  useEffect(() => {
    CodelistsApi.getCodelists().then((codelists) => {
      setCodelists(Object.values(codelists));
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (deleting) return <Deleting />;

  if (publishing) return <Publishing />;

  return (
    <>
      <ComponentTitle component={codelist} />
      <PartialCodelistDetailView
        {...props}
        col={2}
        codelist={codelist}
        handleBack={() => goBack("/codelists")}
        handleUpdate={`/codelists/partial/${codelist.id}/modify`}
        handleDelete={() => setModalOpened(true)}
        deletable
        modalOpened={modalOpened}
        handleYes={handleDelete}
        handleNo={() => setModalOpened(false)}
        secondLang={secondLang}
        mutualized={true}
        updatable={true}
        serverSideError={serverSideError || loadingError}
        publishComponent={publish}
      />
    </>
  );
};
