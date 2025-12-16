import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Deleting, Publishing, Loading } from "@components/loading";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useGoBack } from "@utils/hooks/useGoBack";

import { CodeListApi } from "../../../sdk";
import { API } from "../../apis";
import D from "../../i18n/build-dictionary";
import { formatPartialCodeList } from "../../utils";
import ComponentTitle from "../codelist-detail/title";
import { CodeListPartialDetailView } from "./view";

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
    data: codelist,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["partial-codes-list", id],
    enabled: codelists.length > 0,
    queryFn: () => {
      return API.getCodelistPartial(id).then((cl) => {
        const idParent = codelists.find((codelist) => codelist.uri === cl.iriParent)?.id;

        if (!idParent) {
          return;
        }
        return CodeListApi.getCodesListCodes(idParent, 1, 0).then((codes) => {
          return formatPartialCodeList(cl, codes.items);
        });
      });
    },
  });

  const publish = () => {
    setPublishing(true);

    API.publishPartialCodelist(id)
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
    API.deleteCodelistPartial(id)
      .then(() => {
        goBack("/codelists");
      })
      .catch((error) => {
        setServerSideError(D["errors_" + JSON.parse(error).code]);
      })
      .finally(() => {
        setDeleting(false);
        setModalOpened(false);
      });
  };

  useEffect(() => {
    API.getCodelists().then((codelists) => {
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
      <CodeListPartialDetailView
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
        serverSideError={serverSideError}
        publishComponent={publish}
      />
    </>
  );
};
