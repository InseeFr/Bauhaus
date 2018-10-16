import React from 'react';
import { shallow } from 'enzyme';
import OperationsIndicatorVisualization from './general';
import DisplayLinks from 'js/components/operations/shared/links/';
import SeeAlso from 'js/components/operations/shared/seeAlso';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};
const organisations = [
	{ id: 'CNAMTS', label: 'Agence centrale des organismes de sécurité sociale' },
	{ id: 'DG75-F110', label: "Banque Publique d'Investissement" },
];
const indicator = {
	creator: 'CNAMTS',
	prefLabelLg1: 'Index Divers (base 2010)',
	prefLabelLg2: 'Various indices for construction (Base 2010)',
	replaces: [
		{
			labelLg2: 'Various indices for Previous Construction Bases',
			labelLg1: 'Index Divers (base antérieure à 2010)',
			id: 'p1662',
			type: 'indicator',
		},
	],
	accrualPeriodicityList: 'CL_FREQ',
	seeAlso: [
		{
			labelLg2: 'Building Index base 2010',
			labelLg1: 'Index Batiment 2010',
			id: 'p1622',
			type: 'indicator',
		},
		{
			labelLg2:
				'Building and public works index (reference 1974 and reference 1975)',
			labelLg1: 'Index Bâtiment et Travaux Publics (bases 1974 et 1975)',
			id: 'p1623',
			type: 'indicator',
		},
		{
			labelLg2: 'Public works Indice (base 2010)',
			labelLg1: 'Index Travaux Publics (base 2010)',
			id: 'p1660',
			type: 'indicator',
		},
	],
	wasGeneratedBy: [
		{
			labelLg2: 'Survey on observation of prices in industry and services',
			labelLg1: "Enquête observation des prix de l'industrie et des services",
			id: 's1353',
			type: 'series',
		},
	],
	abstractLg1:
		"En application du décret 2014-114 du 7 février 2014 et de la circulaire du 16 mai 2014 (BOAC 60 de septembre-octobre 2014 la maîtrise d'ouvrage des index nationaux Bâtiment (BT), Travaux publics (TP) et divers de la construction est transférée à l’Insee. Les index Bâtiment, Travaux publics et divers de la construction ont été annoncés au Journal Officiel le 20 décembre 2014 et publiés le 16 janvier 2015 en base 2010 depuis janvier 2010 à octobre 2014. \nLe changement de base signifie un changement de référence (moyenne de 2010 = 100), mais aussi une mise à jour des pondérations et des conventions méthodologiques. \nCes index sont utilisés pour les actualisations et révisions des prix des marchés de construction.",
	abstractLg2:
		'In application of Decree 2014-114 of 7 February 2014 and of circular of 16 May 2014 (BOAC 60 September-October 2014) the responsibility of building (BT), public works (TP) and various construction (ID) indices is transferred to INSEE. The building (BT), public works (TP) and various construction (ID) indices were announced in the Official Journal of December 20, 2014 and published on January 16th, 2015 in base 2010 since January 2010 until October 2014.\nThe base change means a change of reference period (average  2010 = 100), but also an update of weights and methodological conventions.\nThese indices are used for escalation and update of construction contracts.',
	historyNoteLg2:
		'BOAC 60 de septembre-octobre 2014\nBefore Decree 2014-114 of 7 February 2014 and circular of 16 May 2014 (BOAC 60 September-October 2014), the Building (BT), Public Works (TP) and various construction indices were compiled and disseminated under the responsibility of Ministry of Ecology, Sustainable Development and Energy, since 1974 for most Building indices, 1975 for most Public Works indices, 1973 or diverse dates after 2000 for various ndices.',
	stakeHolder: [
		{
			id: 'CNAMTS',
		},
	],
	historyNoteLg1:
		"En application du décret 2014-114 du 7 février 2014 et de la circulaire du 16 mai 2014 (BOAC 60 de septembre-octobre 2014  la maîtrise d'ouvrage des index nationaux Bâtiment, Travaux publics et divers de la construction des index est transférée à l'Insee.",
	accrualPeriodicityCode: 'M',
	id: 'p1649',
	isReplacedBy: [
		{
			labelLg2: 'Various indices for Previous Construction Bases',
			labelLg1: 'Index Divers (base antérieure à 2010)',
			id: 'p1662',
			type: 'indicator',
		},
	],
};
describe('IndicatorInformation', () => {
	it('should renderer all informations for the main lang', () => {
		const general = shallow(
			<OperationsIndicatorVisualization attr={indicator} langs={langs} />
		);
		expect(general.find(DisplayLinks).length).toBe(4);
		expect(general.find(SeeAlso).length).toBe(1);
	});

	it('should show the right number of DisplayLinks component', () => {
		const component = shallow(
			<OperationsIndicatorVisualization
				attr={indicator}
				secondLang={true}
				langs={langs}
			/>
		);
		expect(component.find(DisplayLinks).length).toBe(4);
	});
	it('should show the right data in the DisplayLinks component', () => {
		const component = shallow(
			<OperationsIndicatorVisualization
				attr={indicator}
				secondLang={true}
				langs={langs}
				organisations={organisations}
			/>
		);
		const displayLinks = component.find(DisplayLinks);

		const stakeHolder = displayLinks.get(0);
		expect(stakeHolder.props.links).toEqual([
			{
				id: 'CNAMTS',
				label: 'Agence centrale des organismes de sécurité sociale',
			},
		]);
		expect(stakeHolder.props.path).toBeUndefined();
		expect(stakeHolder.props.displayLink).toBeFalsy();

		const replaces = displayLinks.get(1);
		expect(replaces.props.links).toEqual([
			{
				id: 'p1662',
				labelLg1: 'Index Divers (base antérieure à 2010)',
				labelLg2: 'Various indices for Previous Construction Bases',
				type: 'indicator',
			},
		]);
		expect(replaces.props.path).toEqual('/operations/indicator/');

		const replacedBy = displayLinks.get(2);
		expect(replacedBy.props.links).toEqual([
			{
				id: 'p1662',
				labelLg1: 'Index Divers (base antérieure à 2010)',
				labelLg2: 'Various indices for Previous Construction Bases',
				type: 'indicator',
			},
		]);
		expect(replacedBy.props.path).toEqual('/operations/indicator/');

		const wasGeneratedBy = displayLinks.get(3);
		expect(wasGeneratedBy.props.links).toEqual([
			{
				id: 's1353',
				labelLg1: "Enquête observation des prix de l'industrie et des services",
				labelLg2: 'Survey on observation of prices in industry and services',
				type: 'series',
			},
		]);
		expect(wasGeneratedBy.props.path).toEqual('/operations/series/');
	});
	it('should show the right number of SeeAlso component', () => {
		const component = shallow(
			<OperationsIndicatorVisualization
				attr={indicator}
				secondLang={true}
				langs={langs}
			/>
		);
		const seeAlso = component.find(SeeAlso).first();
		expect(seeAlso.props().links).toEqual({
			indicator: [
				{
					id: 'p1622',
					labelLg1: 'Index Batiment 2010',
					labelLg2: 'Building Index base 2010',
					type: 'indicator',
				},
				{
					id: 'p1623',
					labelLg1: 'Index Bâtiment et Travaux Publics (bases 1974 et 1975)',
					labelLg2:
						'Building and public works index (reference 1974 and reference 1975)',
					type: 'indicator',
				},
				{
					id: 'p1660',
					labelLg1: 'Index Travaux Publics (base 2010)',
					labelLg2: 'Public works Indice (base 2010)',
					type: 'indicator',
				},
			],
		});
	});
});
