import { NONE } from 'js/constants';
import prefixWithHttp from 'js/utils/prefix-with-http';
import takeKeys from 'js/utils/take-keys';

export function processLinks(conceptsWithLinks) {
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
	return Object.keys(linksObj).reduce((linkArr, typeOfLink) => {
		const ids = linksObj[typeOfLink];
		linkArr.push({
			typeOfLink,
			ids,
		});
		return linkArr;
	}, []);
}

export function processGeneral(general, keys) {
	const extract = takeKeys(keys);
	general = extract(general);
	general.additionalMaterial = prefixWithHttp(general.additionalMaterial);
	general.valid = general.valid.replace(
		/T[0-9]{2}:00:00.000Z/,
		'T00:00:00.000Z'
	);
	return general;
}
