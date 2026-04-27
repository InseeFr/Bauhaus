import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { StructureApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../deprecated-locales";
import { EditionForm } from "./components/EditionForm";

export const Component = () => {
  const location = useLocation();
  const duplicate = location.pathname.includes("/duplicate");

  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const [structure, setStructure] = useState({});

  useTitle(D.structuresTitle, structure?.labelLg1);

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
    );
  }

  return <EditionForm creation={duplicate} initialStructure={structure} />;
};
