import { NONE } from "@sdk/constants";

import { prefixWithHttp } from "@utils/prefix-with-http";
import { takeKeys } from "@utils/take-keys";

export function processLinks(conceptsWithLinks: any[]) {
  /*
    Links should like [
      {
        typeOfLink: 'broader',
        ids: ['first-concept']
      }, {
        typeOfLink: 'narrower',
        ids: ['second-concept']
      }
      // if there is no concept for a type of link, we do not create an entry
      //in tthe array
    ]
    //no entry if there no links of a given type
    }
  */
  //First we represent the information as an object to allow iterating over
  //the object keys later
  const linksObj = conceptsWithLinks.reduce((links, { id, typeOfLink }) => {
    if (typeOfLink === NONE) return links;
    if (!links[typeOfLink]) links[typeOfLink] = [id];
    else links[typeOfLink].push(id);
    return links;
  }, {});
  //We should create an entry for each of the key of `linksOb`
  return Object.keys(linksObj).reduce((linkArr: any[], typeOfLink) => {
    const ids = linksObj[typeOfLink];
    linkArr.push({
      typeOfLink,
      ids,
    });
    return linkArr;
  }, []);
}

export function processGeneral(general: any, keys: any[]) {
  const extract = takeKeys(keys);
  general = extract(general);
  general.additionalMaterial = prefixWithHttp(general.additionalMaterial);
  general.valid = general.valid.replace(/T\d{2}:00:00.000Z/, "T00:00:00.000Z");
  return general;
}
