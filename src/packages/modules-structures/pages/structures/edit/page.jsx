import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";

import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { StructureApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { EditionForm } from "./components/EditionForm";

export const Component = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const duplicate = location.pathname.includes("/duplicate");

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const [structure, setStructure] = useState({});

  useTitle(t("structure.pluralTitle"), structure?.labelLg1);

  useEffect(() => {
    StructureApi.getStructure(id)
      .then((res) => setStructure(res))
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loading />;

  if (duplicate) {
    return (
      <>
        <PageTitle title={t("structure.duplicationPageTitle") + `${structure.labelLg1}`} />
        <EditionForm
          creation={duplicate}
          initialStructure={{
            identifiant: structure.identifiant,
            labelLg1: structure.labelLg1,
            labelLg2: structure.labelLg2,
            id: "",
            creator: structure.creator,
            contributor: structure.contributor,
            disseminationStatus: structure.disseminationStatus,
            componentDefinitions: structure.componentDefinitions.map((cd) => {
              return {
                component: cd.component,
                order: cd.order,
                required: cd.required,
                attachment: cd.attachment,
              };
            }),
          }}
        />
      </>
    );
  }

  return (
    <>
      <PageTitleBlock titleLg1={structure.labelLg1} titleLg2={structure.labelLg2} />
      <EditionForm creation={duplicate} initialStructure={structure} />
    </>
  );
};
