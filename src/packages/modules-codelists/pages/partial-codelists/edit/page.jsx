import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { CodelistsApi } from "@sdk/index";
import { formatPartialCodelist } from "../../../utils/formatPartialCodelist";
import { PartialCodelistDetailEdit } from "./components/PartialCodelistDetailEdit";
import { useGoBackOrReplace } from "../../../hooks/useGoBackOrReplace";

export const Component = (props) => {
  const { id } = useParams();

  const goBackOrReplace = useGoBackOrReplace();

  const [loadingList, setLoadingList] = useState(true);
  const [loadingLists, setLoadingLists] = useState(true);

  const [saving, setSaving] = useState(false);

  const [codelist, setCodelist] = useState({});

  const [globalCodeListOptions, setGlobalCodeListOptions] = useState([]);

  const [serverSideError, setServerSideError] = useState("");

  const handleBack = useCallback(() => {
    goBackOrReplace("/codelists/partial", true);
  }, [goBackOrReplace]);

  const handleSave = useCallback(
    (codelist, parentCodes) => {
      setSaving(true);
      setServerSideError("");
      const payload = {
        ...codelist,
        codes: parentCodes
          .filter((code) => code.isPartial)
          .reduce((acc, c) => {
            return {
              ...acc,
              [c.code]: {
                ...c,
              },
            };
          }, {}),
      };
      const request = id ? CodelistsApi.putCodelistPartial : CodelistsApi.postCodelistPartial;
      request(payload)
        .then(() => {
          goBackOrReplace(`${codelist.id}`, !!id);
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
    CodelistsApi.getCodelists()
      .then((codelists) => {
        setGlobalCodeListOptions(
          Object.values(codelists).map((cl) => {
            return {
              value: cl.id,
              label: cl.labelLg1,
              iriParent: cl.uri,
            };
          }),
        );
      })
      .finally(() => setLoadingLists(false));
  }, []);

  useEffect(() => {
    if (id && globalCodeListOptions && globalCodeListOptions[0]) {
      CodelistsApi.getCodelistPartial(id)
        .then((cl) => {
          const idParent = globalCodeListOptions.find(
            (parent) => parent.iriParent === cl.iriParent,
          ).value;
          return CodelistsApi.getCodesListCodes(idParent, 1, 0).then((codes) => {
            setCodelist(formatPartialCodelist(cl, codes.items));
          });
        })
        .catch((error) => setServerSideError(error))
        .finally(() => setLoadingList(false));
    } else {
      setCodelist({});
      setLoadingList(false);
    }
  }, [id, globalCodeListOptions]);

  if (loadingList || loadingLists) {
    return <Loading />;
  }

  if (saving) {
    return <Saving />;
  }

  return (
    <PartialCodelistDetailEdit
      {...props}
      col={2}
      codelist={codelist}
      handleBack={handleBack}
      handleSave={handleSave}
      updateMode={id !== undefined}
      globalCodeListOptions={globalCodeListOptions}
      serverSideError={serverSideError}
    />
  );
};
