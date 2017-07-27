import React from 'react';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import { sortArray } from 'js/utils/array-utils';
import { BROADER, NARROWER, REFERENCES, SUCCEED, RELATED } from 'js/constants';
const sortByLabelFr = sortArray('prefLabelLg1');
const sortByLabelEn = sortArray('prefLabelLg2');

function ConceptLinks({ english, links }) {
  const cl = english ? 'col-md-6' : 'col-md-12';

  const conceptParent = [];
  const conceptEnfants = [];
  const conceptRef = [];
  const conceptSucceed = [];
  const conceptLink = [];

  for (var i = 0; i < links.length; i++) {
    if (links[i].typeOfLink === BROADER) {
      conceptParent.push(links[i]);
    }
    if (links[i].typeOfLink === NARROWER) {
      conceptEnfants.push(links[i]);
    }
    if (links[i].typeOfLink === REFERENCES) {
      conceptRef.push(links[i]);
    }
    if (links[i].typeOfLink === SUCCEED) {
      conceptSucceed.push(links[i]);
    }
    if (links[i].typeOfLink === RELATED) {
      conceptLink.push(links[i]);
    }
  }

  const conceptParentListFr = sortByLabelFr(conceptParent).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg1}
      </Link>
    </li>
  );
  const conceptParentListEn = sortByLabelEn(conceptParent).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg2}
      </Link>
    </li>
  );
  const conceptEnfantsListFr = sortByLabelFr(conceptEnfants).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg1}
      </Link>
    </li>
  );
  const conceptEnfantsListEn = sortByLabelEn(conceptEnfants).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg2}
      </Link>
    </li>
  );
  const conceptRefListFr = sortByLabelFr(conceptRef).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg1}
      </Link>
    </li>
  );
  const conceptRefListEn = sortByLabelEn(conceptRef).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg2}
      </Link>
    </li>
  );
  const conceptSucceedListFr = sortByLabelFr(conceptSucceed).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg1}
      </Link>
    </li>
  );
  const conceptSucceedListEn = sortByLabelEn(conceptSucceed).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg2}
      </Link>
    </li>
  );
  const conceptLinkListFr = sortByLabelFr(conceptLink).map(item =>
    <li key={item.id}>
      <Link to={'/concept/' + item.id}>
        {item.prefLabelLg1}
      </Link>
    </li>
  );
  const conceptLinkListEn = sortByLabelEn(conceptLink).map(item =>
    <li key={item.idLinked}>
      <Link to={'/concept/' + item.idLinked}>
        {item.prefLabelLg2}
      </Link>
    </li>
  );

  const isEmpty = array => {
    if (array.length === 0) return false;
    else return true;
  };

  return (
    <div className="row">
      <div className={cl}>
        <Panel title={dictionary.links.title}>
          <ul>
            {isEmpty(conceptParent) &&
              <li>
                {dictionary.links.narrower} :
                <ul>{conceptParentListFr}</ul>
              </li>}
            {isEmpty(conceptEnfants) &&
              <li>
                {dictionary.links.broader} :
                <ul>{conceptEnfantsListFr}</ul>
              </li>}
            {isEmpty(conceptRef) &&
              <li>
                {dictionary.links.references} :
                <ul>{conceptRefListFr}</ul>
              </li>}
            {isEmpty(conceptSucceed) &&
              <li>
                {dictionary.links.replaces} :
                <ul>{conceptSucceedListFr}</ul>
              </li>}
            {isEmpty(conceptLink) &&
              <li>
                {dictionary.links.related} :
                <ul>{conceptLinkListFr}</ul>
              </li>}
          </ul>
        </Panel>
      </div>
      {english &&
        <div className={cl}>
          <Panel title={dictionary.links.title}>
            <ul>
              {isEmpty(conceptParent) &&
                <li>
                  {dictionary.links.narrower} :
                  <ul>{conceptParentListEn}</ul>
                </li>}
              {isEmpty(conceptEnfants) &&
                <li>
                  {dictionary.links.broader} :
                  <ul>{conceptEnfantsListEn}</ul>
                </li>}
              {isEmpty(conceptRef) &&
                <li>
                  {dictionary.links.references} :
                  <ul>{conceptRefListEn}</ul>
                </li>}
              {isEmpty(conceptSucceed) &&
                <li>
                  {dictionary.links.replaces} :
                  <ul>{conceptSucceedListEn}</ul>
                </li>}
              {isEmpty(conceptLink) &&
                <li>
                  {dictionary.links.related} :
                  <ul>{conceptLinkListEn}</ul>
                </li>}
            </ul>
          </Panel>
        </div>}
    </div>
  );
}

export default ConceptLinks;
