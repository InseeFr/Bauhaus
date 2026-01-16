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
  putDocumentFile: (document: any, formData: any) => [
    `documents/document/${document.id}/file`,
    {
      headers: {},
      body: formData,
    },
    () => Promise.resolve(document.id),
  ],
};

export const GeneralApi = buildApi("", generalApi);
