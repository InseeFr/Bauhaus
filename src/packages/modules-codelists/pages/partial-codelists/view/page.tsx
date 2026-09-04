import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Deleting, Loading, Publishing } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { ComponentTitle } from "../../../components/ComponentTitle";
import { formatPartialCodelist } from "../../../utils/formatPartialCodelist";
import { PartialCodelistDetailView } from "./components/PartialCodelistDetailView";

export const Component = () => {
  const goBack = useGoBack();

  const [secondLang] = useSecondLang();

  const { id } = useParams();

  const [deleting, setDeleting] = useState(false);

  const [publishing, setPublishing] = useState(false);

  const [codelists, setCodelists] = useState<any[]>([]);

  const [modalOpened, setModalOpened] = useState(false);

  const [serverSideError, setServerSideError] = useState<unknown>("");

  const {
    data: codelist = {},
    isLoading,
    refetch,
    error: loadingError,
  } = useQuery({
    queryKey: ["partial-code-list", id],
    enabled: codelists.length > 0,
    queryFn: () => {
      return CodelistsApi.getCodelistPartial(id).then((cl: any) => {
        const idParent = codelists.find((codelist) => codelist.uri === cl.iriParent)?.id;
        if (!idParent) {
          return;
        }
        return CodelistsApi.getCodelistCodes(idParent, 1, 0).then((codes: any) => {
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
      .catch((error: unknown) => {
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
      .catch((error: unknown) => {
        setServerSideError(error);
      })
      .finally(() => {
        setDeleting(false);
        setModalOpened(false);
      });
  };

  useEffect(() => {
    CodelistsApi.getCodelists().then((codelists: Record<string, any>) => {
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
      <ComponentTitle component={codelist as any} />
      <PartialCodelistDetailView
        codelist={codelist as any}
        handleBack={() => goBack("/codelists")}
        handleUpdate={`/codelists/partial/${(codelist as any).id}/modify`}
        handleDelete={() => setModalOpened(true)}
        deletable
        modalOpened={modalOpened}
        handleYes={handleDelete}
        handleNo={() => setModalOpened(false)}
        secondLang={secondLang}
        updatable={true}
        serverSideError={serverSideError || loadingError}
        publishComponent={publish}
      />
    </>
  );
};
