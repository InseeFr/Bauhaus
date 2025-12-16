import { useEffect } from "react";

export const setDocumentTitle = (application?: string, page?: string) => {
  document.title = [page, application, "Bauhaus"].filter((item) => !!item).join(" - ");
};

export const useTitle = (application?: string, page?: string) => {
  useEffect(() => {
    setDocumentTitle(application, page);
  }, [application, page]);
};
