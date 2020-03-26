import { getRDFList } from 'bauhaus-utilities';

const query = `
PREFIX skos:<http://www.w3.org/2004/02/skos/core#>

SELECT ?label ?value WHERE {
	?value skos:inScheme ?conceptScheme .
	?value skos:prefLabel ?label .
	FILTER(regex(str(?conceptScheme),'/concepts/definitions/scheme'))
	FILTER(lang(?label) = 'fr')
}
ORDER BY ?label
`;

export const getConcepts = () => getRDFList('http://id.insee.fr/sparql')(query);
