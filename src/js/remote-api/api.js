import { baseHost } from 'config/config';
import buildApi from './build-api';

const api = {
  getConceptList: () => ['concepts'],
  getConceptSearchList: () => ['concepts/search'],
  getConceptValidList: () => ['concepts/toValidate'],
  getConceptGeneral: id => [`concept/${id}]`],
  getConceptLinkList: id => [`concept/${id}/links`],
  getConceptVersionNoteList: (id, version) => [
    `concept/${id}/notes/${version}`,
  ],
  postConcept: concept => [
    'private/concept',
    {
      body: JSON.stringify(concept),
    },
    res =>
      res.text(id => ({
        id,
        concept,
      })),
  ],
  putConcept: (id, concept) => [`private/concept/${id}`],
  putConceptValitList: concepts => [`private/concepts/validate`],
  //TODO weird api
  postConceptExport: id => [
    'concept/export',
    {
      body: id,
    },
  ],
  postConceptSend: id => [
    'private/concept/send',
    {
      body: id,
    },
  ],
  getDissStatusList: () => ['disseminationStatus'],
  getStampList: () => ['stamps'],
};

export default buildApi(baseHost, api);
