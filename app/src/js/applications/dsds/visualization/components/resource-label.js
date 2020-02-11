import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from 'index';
import { Flag } from '@inseefr/ui';
import { getRDFObject } from 'js/applications/dsds/utils/sparql-endpoint-call';
import { getFlag } from 'js/utils/flags/get-flag';

const ResourceLabel = ({ title, URI }) => {
	const [labels, setLabels] = useState({});

	const { lg1, lg2 } = useContext(AppContext);

	useEffect(() => {
		const query = URI => `
    PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
    PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    
    SELECT ?labelLg1 ?labelLg2 WHERE {
        OPTIONAL{<${URI}> skos:prefLabel|rdfs:label ?labelLg1 .
        FILTER (lang(?labelLg1) = '${lg1}')} .
        OPTIONAL{<${URI}> skos:prefLabel|rdfs:label ?labelLg2 .
        FILTER (lang(?labelLg2) = '${lg2}')} .
    }
    `;
		getRDFObject('https://id.insee.fr/sparql')(query(URI)).then(res =>
			setLabels(res)
		);
	}, [URI, lg1, lg2]);

	const { labelLg1, labelLg2 } = labels;

	return labelLg1 || labelLg2 ? (
		<li>
			{title} :
			<ul>
				{labelLg1 && (
					<li>
						<Flag flag={getFlag(lg1)} /> : {labelLg1}
					</li>
				)}
				{labelLg2 && (
					<li>
						<Flag flag={getFlag(lg2)} /> : {labelLg2}
					</li>
				)}
			</ul>
		</li>
	) : null;
};

export default ResourceLabel;
