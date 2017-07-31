import { baseHost } from 'config/config';

const urlGetCollectionsList = baseHost + 'collections';
const urlGetCollection = baseHost + 'collection';
const urlPostCollections = baseHost + 'private/collections';
const urlPostModifiedCollections = baseHost + 'private/collection';
const urlGetCollectionsToValidateList = baseHost + 'collections/toValidate';
const urlPostCollectionsToValidate = baseHost + 'private/collections/validate';
const urlPostCollectionsToExport = baseHost + 'private/collections/export';
const urlPostCollectionSend = baseHost + 'private/collection/send';

export const getCollectionsList = () =>
  fetch(urlGetCollectionsList, {
    headers: {
      Accept: 'application/json',
    },
  }).then(res => res.json());

export const getCollectionsToValidateList = () =>
  fetch(urlGetCollectionsToValidateList, {
    headers: {
      Accept: 'application/json',
    },
  }).then(res => res.json());

export const getCollection = id =>
  fetch(urlGetCollection + '/' + id, {
    headers: {
      Accept: 'application/json',
    },
  }).then(res => res.json());

export const getCollectionMembers = id =>
  fetch(urlGetCollection + '/' + id + '/members', {
    headers: {
      Accept: 'application/json',
    },
  }).then(res => res.json());

export const postCollections = collection =>
  fetch(urlPostCollections, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(collection),
  });

export const postModifiedCollections = (id, collection) =>
  fetch(urlPostModifiedCollections + '/' + id, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(collection),
  });

export const postCollectionsToValidate = collection =>
  fetch(urlPostCollectionsToValidate, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(collection),
  });

export const postCollectionsToExport = collection =>
  fetch(urlPostCollectionsToExport, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(collection),
  });

export const postCollectionSend = collection =>
  fetch(urlPostCollectionSend, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(collection),
  });
