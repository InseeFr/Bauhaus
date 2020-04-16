import React from 'react';
import { storiesOf } from '@storybook/react';
import ComponentSelector from '.';
const stories = storiesOf('ComponentSelector', module);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

const mutualizedComponents = [
	{
		id: '5e7334002a5c764f68247222',
		identifiant: '5e7334002a5c764f68247222',
		labelLg1: 'veniam non irure',
		labelLg2: 'nisi aliquip',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 439,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 942,
		range: 'http://www.w3.org/2001/XMLSchema#codeList',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
		validationState: 'Validated',
	},
	{
		id: '5e7334005ed839722436a194',
		identifiant: '5e7334005ed839722436a194',
		labelLg1: 'elit duis occaecat',
		labelLg2: 'deserunt in',
		type: 'http://purl.org/linked-data/cube#measure',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 385,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 507,
		range: 'http://www.w3.org/2001/XMLSchema#float',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e73340005f2ec3bb1f3c650',
		identifiant: '5e73340005f2ec3bb1f3c650',
		labelLg1: 'consequat dolore enim',
		labelLg2: 'officia duis',
		type: 'http://purl.org/linked-data/cube#attribute',
		attachment: 'http://purl.org/linked-data/cube#Slice',
		concept: 103,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 377,
		range: 'http://www.w3.org/2001/XMLSchema#int',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e73340055721b9d0973ff2f',
		identifiant: '5e73340055721b9d0973ff2f',
		labelLg1: 'elit amet minim',
		labelLg2: 'elit ex',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 792,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 471,
		range: 'http://www.w3.org/2001/XMLSchema#float',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334003b50ee5e36822866',
		identifiant: '5e7334003b50ee5e36822866',
		labelLg1: 'quis tempor eu',
		labelLg2: 'labore reprehenderit',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Slice',
		concept: 936,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 278,
		range: 'http://www.w3.org/2001/XMLSchema#int',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e733400d8aa9a26c5f52628',
		identifiant: '5e733400d8aa9a26c5f52628',
		labelLg1: 'aliqua esse non',
		labelLg2: 'irure quis',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 566,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 174,
		range: 'http://www.w3.org/2001/XMLSchema#string',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334009457f744b1476876',
		identifiant: '5e7334009457f744b1476876',
		labelLg1: 'reprehenderit proident pariatur',
		labelLg2: 'et incididunt',
		type: 'http://purl.org/linked-data/cube#attribute',
		attachment: 'http://purl.org/linked-data/cube#DataSet',
		concept: 141,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 415,
		range: 'http://www.w3.org/2001/XMLSchema#string',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334003d12d6a0b6dbd5b7',
		identifiant: '5e7334003d12d6a0b6dbd5b7',
		labelLg1: 'dolor aute minim',
		labelLg2: 'culpa adipisicing',
		type: 'http://purl.org/linked-data/cube#measure',
		attachment: 'http://purl.org/linked-data/cube#Slice',
		concept: 526,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 216,
		range: 'http://www.w3.org/2001/XMLSchema#string',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e733400ef4fb3a62c5d6dd1',
		identifiant: '5e733400ef4fb3a62c5d6dd1',
		labelLg1: 'occaecat duis aliqua',
		labelLg2: 'exercitation officia',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#Observation',
		concept: 201,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 356,
		range: 'http://www.w3.org/2001/XMLSchema#string',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334003a17b4f43903b3ad',
		identifiant: '5e7334003a17b4f43903b3ad',
		labelLg1: 'esse duis sint',
		labelLg2: 'quis nostrud',
		type: 'http://purl.org/linked-data/cube#attribute',
		attachment: 'http://purl.org/linked-data/cube#Slice',
		concept: 765,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 973,
		range: 'http://www.w3.org/2001/XMLSchema#date',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334006a716eeb6276126a',
		identifiant: '5e7334006a716eeb6276126a',
		labelLg1: 'ex Lorem excepteur',
		labelLg2: 'aliquip aliqua',
		type: 'http://purl.org/linked-data/cube#attribute',
		attachment: 'http://purl.org/linked-data/cube#Slice',
		concept: 848,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 274,
		range: 'http://www.w3.org/2001/XMLSchema#string',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
	{
		id: '5e7334003c98f68f2f5acd74',
		identifiant: '5e7334003c98f68f2f5acd74',
		labelLg1: 'esse adipisicing proident',
		labelLg2: 'mollit incididunt',
		type: 'http://purl.org/linked-data/cube#dimension',
		attachment: 'http://purl.org/linked-data/cube#DataSet',
		concept: 575,
		isCoded: '<SyntaxError: missing ) after argument list>)',
		codeList: 813,
		range: 'http://www.w3.org/2001/XMLSchema#date',
		descriptionLg1: '*Ceci est une description*',
		descriptionLg2: '*Ceci est une description*',
	},
];

const components = [
	{ ...mutualizedComponents[0] },
	{ ...mutualizedComponents[1] },
	{ ...mutualizedComponents[2] },
];

const concepts = mutualizedComponents.map(component => ({
	altLabel: '',
	id: component.concept.toString(),
	label: 'Concept - Label ' + component.concept,
}));
const codesLists = mutualizedComponents.map(component => ({
	altLabel: '',
	id: component.codeList.toString(),
	label: 'Code List - Label ' + component.concept,
}));

stories.add('Default', () => {
	return (
		<ComponentSelector
			components={components}
			codesLists={codesLists}
			concepts={concepts}
			mutualizedComponents={mutualizedComponents}
		/>
	);
});
