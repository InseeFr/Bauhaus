import { buildApi } from "./build-api";

const generalApi = {
  getInit: () => [
    "init",
    {
      headers: {
        Accept: "application/json",
      },
    },
    (res: Response) => res,
  ],
  getDocumentsList: () => ["documents"],
  getDocument: (id: string, type: string) => [`documents/${type}/${id}`],
  postDocument: (formData: any) => [
    `documents/document`,
    {
      headers: {},
      body: formData,
    },
    (res: Response) => res.text(),
  ],
  postLink: (formData: any) => [
    `documents/link`,
    {
      headers: {},
      body: formData,
    },
    (res: Response) => res.text(),
  ],
  putDocument: (document: any) => [
    `documents/document/${document.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    },
    () => Promise.resolve(document.id),
  ],
  putLink: (document: any) => [
    `documents/link/${document.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    },
    () => Promise.resolve(document.id),
  ],
  // Renvoie la nouvelle URL du fichier, ou une chaîne vide si le nom n'a pas changé.
  putDocumentFile: (document: any, formData: any) => [
    `documents/document/${document.id}/file`,
    {
      headers: {},
      body: formData,
    },
    (res: Response) => res.text(),
  ],
};

export const GeneralApi = buildApi("", generalApi) as any;
