import { baseHost } from 'config/config';
import buildApi from './build-api';

//TODO then handler should not default to res => res.json() when no response
//body is expected.
//Change signature to (params) => [url, thenHandler, options] and pass
//json as a then handler for all GET calls
//const json = res => res.json()
//getConcepteList: () => ['concepts', json]
const api = {
  getConceptList: () => ['concepts'],
  getConceptSearchList: () => ['concepts/search'],
  getConceptValidateList: () => ['concepts/toValidate'],
  getConceptGeneral: id => [`concept/${id}`],
  getConceptLinkList: id => [`concept/${id}/links`],
  getNoteVersionList: (id, version) => [`concept/${id}/notes/${version}`],
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
  putConceptValidList: concepts => [`private/concepts/validate`],
  //TODO weird api
  postConceptExport: id => [
    'concept/export',
    {
      body: id,
    },
    res => res.blob(),
  ],
  //TODO check swagger documentation
  postConceptSend: id => [
    'private/concept/send',
    {
      body: id,
    },
  ],
  getDissStatusList: () => ['disseminationStatus'],
  getStampList: () => ['stamps'],
};

//TODO wrap api in a proxy for developement to catch error when accessing
//an unknown function (the kind of check performed when we import something
//that has not been exported)
export default buildApi(baseHost, api);
