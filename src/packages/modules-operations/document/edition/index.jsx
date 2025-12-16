import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { GeneralApi } from "@sdk/general-api";

import { useCodesList } from "@utils/hooks/codeslist";

import DocumentationEdition from "./edition";

export const Component = (props) => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const type = /(link|document)/.exec(pathname)[1];

  const langOptions = useCodesList("ISO-639");

  const [document, setDocument] = useState({});

  useEffect(() => {
    if (id && type) {
      GeneralApi.getDocument(id, type).then((results) => {
        setDocument({
          ...results,
          id: results.uri.substr(results.uri.lastIndexOf("/") + 1),
        });
      });
    }
  }, [id, type]);

  if (!document.id && id) return <Loading />;

  return (
    <DocumentationEdition
      document={document}
      langOptions={langOptions}
      id={id}
      type={type}
      {...props}
    />
  );
};
