import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading } from "@components/loading";

import { Family } from "@model/operations/family";

import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import { useFamily } from "../../../hooks/useFamilies";
import { OperationsFamilyEdition } from "./components/OperationsFamilyEdition";

// En création, le formulaire part d'une famille vide : aucun appel au back n'est fait.
const NEW_FAMILY = {} as Family;

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams();

  const goBack = useGoBack();

  const { data: family = NEW_FAMILY, error: loadError } = useFamily(id);

  useTitle(t("common.familiesTitle") + " - " + t("common.operationsTitle"), family.prefLabelLg1);

  if (loadError) return <LoadingErrorBloc error={loadError} />;

  if (!family.id && id) return <Loading />;

  return <OperationsFamilyEdition id={id} family={family} goBack={goBack} />;
};
