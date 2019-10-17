import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import { Panel } from 'bauhaus-library';
import { sortArray } from 'js/utils/array-utils';
import { BROADER, NARROWER, REFERENCES, SUCCEED, RELATED } from 'js/constants';
const sortByLabelLg1 = sortArray('prefLabelLg1');
const sortByLabelLg2 = sortArray('prefLabelLg2');

function ConceptLinks({ secondLang, links }) {
	var nbLinks = 0;
	const cl = secondLang ? 'col-md-6' : 'col-md-12';

	const narrower = [];
	const broader = [];
	const references = [];
	const replaces = [];
	const related = [];

	for (var i = 0; i < links.length; i++) {
		if (links[i].typeOfLink === NARROWER) {
			narrower.push(links[i]);
			nbLinks++;
		}
		if (links[i].typeOfLink === BROADER) {
			broader.push(links[i]);
			nbLinks++;
		}
		if (links[i].typeOfLink === REFERENCES) {
			references.push(links[i]);
			nbLinks++;
		}
		if (links[i].typeOfLink === SUCCEED) {
			replaces.push(links[i]);
			nbLinks++;
		}
		if (links[i].typeOfLink === RELATED) {
			related.push(links[i]);
			nbLinks++;
		}
	}

	const buildLi = (array, label) =>
		array.map(item => (
			<li key={item.id}>
				<Link to={'/concept/' + item.id}>{item[label]}</Link>
			</li>
		));

	const buildList = array => ({
		lg1: buildLi(sortByLabelLg1(array), 'prefLabelLg1'),
		lg2: buildLi(sortByLabelLg2(array), 'prefLabelLg2'),
	});

	const narrowerList = buildList(narrower);
	const broaderList = buildList(broader);
	const referencesList = buildList(references);
	const replacesList = buildList(replaces);
	const relatedList = buildList(related);

	const isEmpty = array => {
		if (array.length === 0) return false;
		else return true;
	};

	// Don't display links panel if there isn't links
	if (nbLinks === 0) return null;

	const content = lang => (
		<div className={cl}>
			<Panel title={D.linksTitle}>
				<ul>
					{isEmpty(narrower) && (
						<li>
							{D.narrowerTitle} :<ul>{narrowerList[lang]}</ul>
						</li>
					)}
					{isEmpty(broader) && (
						<li>
							{D.broaderTitle} :<ul>{broaderList[lang]}</ul>
						</li>
					)}
					{isEmpty(references) && (
						<li>
							{D.referencesTitle} :<ul>{referencesList[lang]}</ul>
						</li>
					)}
					{isEmpty(replaces) && (
						<li>
							{D.replacesTitle} :<ul>{replacesList[lang]}</ul>
						</li>
					)}
					{isEmpty(related) && (
						<li>
							{D.relatedTitle} :<ul>{relatedList[lang]}</ul>
						</li>
					)}
				</ul>
			</Panel>
		</div>
	);

	return (
		<div className="row">
			{content('lg1')}
			{secondLang && content('lg2')}
		</div>
	);
}

export default ConceptLinks;
