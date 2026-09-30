import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { sortArrayByLabel } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";

import { ConceptsToValidate } from "./components/ConceptsToValidate";

interface ConceptValidateItem {
  id: string;
  label: string;
  valid?: string | null;
  validationState?: string;
}

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("concept.title"), t("common.btnValid"));

  const [loading, setLoading] = useState<boolean>(true);

  const [publishing, setPublishing] = useState<boolean>(false);

  const [concepts, setConcepts] = useState<ConceptValidateItem[]>([]);

  const [serverSideError, setServerSideError] = useState<unknown>();

  // Le sélecteur ne relit ses éléments qu'au montage : une nouvelle clé le remonte sur la liste
  // rechargée.
  const [listVersion, setListVersion] = useState(0);

  const loadConcepts = () =>
    ConceptsApi.getConceptValidateList().then((body: ConceptValidateItem[]) => {
      setConcepts(sortArrayByLabel(body));
      setListVersion((version) => version + 1);
    });

  const handleValidateConceptList = async (ids: string[]) => {
    setPublishing(true);
    setServerSideError(undefined);
    try {
      await ConceptsApi.putConceptValidList(ids);
      // On reste sur la page : la liste est rechargée pour n'y laisser que les
      // concepts encore provisoires.
      await loadConcepts();
    } catch (error) {
      setServerSideError(error);
    } finally {
      setPublishing(false);
    }
  };

  useEffect(() => {
    loadConcepts()
      .catch(setServerSideError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Le sélecteur reste monté pendant la publication : démonté, il perdrait la sélection, qu'un
  // échec doit laisser intacte.
  return (
    <>
      {publishing && <Publishing />}
      <div hidden={publishing}>
        <ConceptsToValidate
          key={listVersion}
          concepts={concepts}
          handleValidateConceptList={handleValidateConceptList}
          serverSideError={serverSideError}
        />
      </div>
    </>
  );
};
