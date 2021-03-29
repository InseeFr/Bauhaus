import React from 'react';
import { Link } from 'react-router-dom';
import { D1, D2 } from 'js/i18n';
import { Note } from '@inseefr/wilco';
import { ArrayUtils } from 'bauhaus-utilities';
import { BROADER, NARROWER, REFERENCES, SUCCEED, RELATED, CLOSE_MATCH } from 'js/constants';
const sortByLabelLg1 = ArrayUtils.sortArray('prefLabelLg1');
const sortByLabelLg2 = ArrayUtils.sortArray('prefLabelLg2');

const CloseMatchLinks = ({links, Dictionnary}) => {
	return links.length > 0 && (
		<li>{Dictionnary.equivalentTitle} :<ul> {
			links.map(cm => <li key={cm.urn}><a href={cm.urn} target="_blank" rel="noopener noreferrer">{cm.urn}</a></li>)
		}</ul></li>
	)
}
function ConceptLinks({ secondLang, links }) {
	var nbLinks = 0;

	const narrower = [];
	const broader = [];
	const references = [];
	const replaces = [];
	const related = [];
	const closeMatch = [];

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
		if (links[i].typeOfLink === CLOSE_MATCH) {
			closeMatch.push(links[i]);
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

	const content = (lang, alone, Dictionnary = D1) => (
		<Note
			text={
				<ul>
					{isEmpty(narrower) && (
						<li>
							{Dictionnary.narrowerTitle} :<ul>{narrowerList[lang]}</ul>
						</li>
					)}
					{isEmpty(broader) && (
						<li>
							{Dictionnary.broaderTitle} :<ul>{broaderList[lang]}</ul>
						</li>
					)}
					{isEmpty(references) && (
						<li>
							{Dictionnary.referencesTitle} :<ul>{referencesList[lang]}</ul>
						</li>
					)}
					{isEmpty(replaces) && (
						<li>
							{Dictionnary.replacesTitle} :<ul>{replacesList[lang]}</ul>
						</li>
					)}
					{isEmpty(related) && (
						<li>
							{Dictionnary.relatedTitle} :<ul>{relatedList[lang]}</ul>
						</li>
					)}
					<CloseMatchLinks links={closeMatch} Dictionnary={Dictionnary}/>
				</ul>
			}
			title={Dictionnary.linksTitle}
			lang={lang}
			alone={alone}
		/>
	);

	return (
		<div className="row">
			{content('lg1', !secondLang)}
			{secondLang && content('lg2', false, D2)}
		</div>
	);
}

export default ConceptLinks;
