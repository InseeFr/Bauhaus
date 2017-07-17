import React from 'react';
import _ from 'lodash';
import { isDateIn } from 'js/utils/moment';

export const arrayKeepUniqueField = (array, field) =>
  array.map(function(item) {
    return _.deburr(item[field].toLowerCase());
  });

export const arrayDropUniqueField = (array, fieldToRemove) =>
  array.map(row =>
    Object.keys(row).reduce((obj, key) => {
      if (key !== fieldToRemove) {
        return { ...obj, [key]: row[key] };
      }
      return obj;
    }, {})
  );

export const arrayDifferenceByID = (array1, array2) => {
  const diff = _.difference(_.map(array1, 'id'), _.map(array2, 'id'));
  const result = _.filter(array1, function(obj) {
    return diff.indexOf(obj.id) >= 0;
  });
  return result;
};

export const sortArray = key =>
  /**
   * Sort an array by a given key
   *
   * If `desc` is set to true, descending order will be used
   *
   * @param   {array}      arr  array of objects with the key given key
   * @param   {boolean}    desc true if descending order required
   * @returns {array}           the array sorted by the given key
   */

  (arr, desc = false) => {
    const order = desc ? 1 : -1;
    return arr.sort((a, b) => {
      const aUp = _.deburr(a[key]).toLowerCase();
      const bUp = _.deburr(b[key]).toLowerCase();
      return bUp > aUp ? order : bUp === aUp ? 0 : -order;
    });
  };

export function filterByPrefLabelFr(filter) {
  return item =>
    _.deburr(item.prefLabelFr).toLowerCase().includes(filter.toLowerCase());
}

export const filterKeyDeburr = key => (arr, rawStr) => {
  const str = _.deburr(rawStr).toLocaleLowerCase();
  return arr.filter(item => _.deburr(item[key]).includes(str));
};

export function filterByLabel(filter) {
  return item =>
    _.deburr(item.label).toLowerCase().includes(filter.toLowerCase());
}

export function filterByDefinitionFr(filter) {
  return item =>
    _.deburr(item.definitionFr).toLowerCase().includes(filter.toLowerCase());
}
export function filterByCreator(filter) {
  return item =>
    _.deburr(item.creator).toLowerCase().includes(filter.toLowerCase());
}
export function filterByDisseminationStatus(filter) {
  return item =>
    _.deburr(item.disseminationStatus)
      .toLowerCase()
      .includes(filter.replace(' ', '').toLowerCase());
}
export function filterByValidationStatus(filter) {
  return item =>
    _.deburr(item.validationStatus)
      .toLowerCase()
      .includes(filter.toLowerCase());
}
export function filterByCreatedDate(dateStartCreate, dateEndCreate) {
  return item => isDateIn(item.created, dateStartCreate, dateEndCreate);
}
export function filterByModifiedDate(dateStartModify, dateEndModify) {
  return item => isDateIn(item.modified, dateStartModify, dateEndModify);
}

export const creatSelectList = max => {
  const result = [];
  for (var i = 1; i <= max; i++) {
    result.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }
  return result;
};

export const creatSelectListSelectedLast = max => {
  const result = [];
  for (var i = 1; i < max; i++) {
    result.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }
  result.push(
    <option value={max} key={max}>
      {max}
    </option>
  );
  return result;
};

export const creatSelectListFromArrayWithInit = (array, init, attr) => {
  const result = [];
  for (var i = 0; i < array.length; i++) {
    if (attr) {
      if (array[i][attr] === init) {
        result.push(
          <option
            value={array[i][attr]}
            key={array[i][attr]}
            selected="selected">
            {array[i][attr]}
          </option>
        );
      } else
        result.push(
          <option value={array[i][attr]} key={array[i][attr]}>
            {array[i][attr]}
          </option>
        );
    } else {
      if (array[i] === init) {
        result.push(
          <option value={array[i]} key={array[i]} selected="selected">
            {array[i]}
          </option>
        );
      } else
        result.push(
          <option value={array[i]} key={array[i]}>
            {array[i]}
          </option>
        );
    }
  }
  return result;
};

export const creatSelectListFromArrayWithInitText = (array, initText, attr) => {
  const result = [];
  result.push(
    <option value="-1" key="-1" selected="selected" disabled hidden>
      {initText}
    </option>
  );
  for (var i = 0; i < array.length; i++) {
    if (attr) {
      result.push(
        <option value={array[i][attr]} key={array[i][attr]}>
          {array[i][attr]}
        </option>
      );
    } else
      result.push(
        <option value={array[i]} key={array[i]}>
          {array[i]}
        </option>
      );
  }
  return result;
};

//Get members of concept
export const getMembers = (linksArray, typeOfLink) => {
  return linksArray
    .filter(link => link.conceptLink === typeOfLink)
    .map(({ idLinked, prefLabelFr }) => ({ id: idLinked, prefLabelFr }));
};

//Get potentialMembers of concept
export const getPotentialMembers = (conceptsArray, linksArray, currentID) => {
  const idLinks = arrayKeepUniqueField(linksArray, 'idLinked');
  idLinks.push(currentID);
  return conceptsArray.filter(({ id }) => idLinks.indexOf(id) === -1);
};
