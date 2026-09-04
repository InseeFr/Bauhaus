import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { CodelistsApi } from "@sdk/index";

import { useGoBackOrReplace } from "../../../hooks/useGoBackOrReplace";
import { formatPartialCodelist } from "../../../utils/formatPartialCodelist";
import { PartialCodelistDetailEdit } from "./components/PartialCodelistDetailEdit";
import { PickerCode } from "./components/Picker";

export const Component = () => {
  const { id } = useParams();

  const goBackOrReplace = useGoBackOrReplace();

  const [loadingList, setLoadingList] = useState(true);
  const [loadingLists, setLoadingLists] = useState(true);

  const [saving, setSaving] = useState(false);

  const [codelist, setCodelist] = useState<any>({});

  const [globalCodelistOptions, setGlobalCodelistOptions] = useState<
    { value: string; label: string; iriParent: string }[]
  >([]);

  const [serverSideError, setServerSideError] = useState<unknown>("");

  const handleBack = useCallback(() => {
    goBackOrReplace("/codelists/partial", true);
  }, [goBackOrReplace]);

  const handleSave = useCallback(
    (codelist: any, parentCodes: PickerCode[]) => {
      setSaving(true);
      setServerSideError("");
      const payload = {
        ...codelist,
        codes: parentCodes
          .filter((code) => code.isPartial)
          .reduce(
            (acc, c) => {
              return {
                ...acc,
                [c.code]: {
                  ...c,
                },
              };
            },
            {} as Record<string, PickerCode>,
          ),
      };
      const request = id ? CodelistsApi.putCodelistPartial : CodelistsApi.postCodelistPartial;
      request(payload)
        .then(() => {
          goBackOrReplace(`${codelist.id}`, !!id);
        })
        .catch((error: unknown) => {
          setCodelist(codelist);
          setServerSideError(error);
        })
        .finally(() => setSaving(false));
    },
    [goBackOrReplace, id],
  );

  useEffect(() => {
    CodelistsApi.getCodelists()
      .then((codelists: Record<string, any>) => {
        setGlobalCodelistOptions(
          Object.values(codelists).map((cl: any) => {
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
    if (id && globalCodelistOptions && globalCodelistOptions[0]) {
      CodelistsApi.getCodelistPartial(id)
        .then((cl: any) => {
          const idParent = globalCodelistOptions.find(
            (parent) => parent.iriParent === cl.iriParent,
          )!.value;
          return CodelistsApi.getCodelistCodes(idParent, 1, 0).then((codes: any) => {
            setCodelist(formatPartialCodelist(cl, codes.items));
          });
        })
        .catch((error: unknown) => setServerSideError(error))
        .finally(() => setLoadingList(false));
    } else {
      setCodelist({});
      setLoadingList(false);
    }
  }, [id, globalCodelistOptions]);

  if (loadingList || loadingLists) {
    return <Loading />;
  }

  if (saving) {
    return <Saving />;
  }

  return (
    <PartialCodelistDetailEdit
      codelist={codelist}
      handleBack={handleBack}
      handleSave={handleSave}
      updateMode={id !== undefined}
      globalCodelistOptions={globalCodelistOptions}
      serverSideError={serverSideError}
    />
  );
};
