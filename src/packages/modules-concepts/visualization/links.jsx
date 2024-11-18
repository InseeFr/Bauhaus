import { Link } from 'react-router-dom';
import { D1, D2 } from '../../deprecated-locales';
import {
	BROADER,
	CLOSE_MATCH,
	IS_REPLACED_BY,
	NARROWER,
	REFERENCES,
	RELATED,
	SUCCEED,
} from '../../sdk/constants';
import './links.scss';
import { sortArray } from '../../utils/array-utils';
import { Note } from '@components/note';

const CloseMatchLinks = ({ links, Dictionnary }) => {
	return (
		links.length > 0 && (
			<li>
				{Dictionnary.equivalentTitle} :
				<ul>
					{links.map((cm) => (
						<li key={cm.urn}>
							<a href={cm.urn} target="_blank" rel="noopener noreferrer">
								{cm.urn}
							</a>
						</li>
					))}
				</ul>
			</li>
		)
	);
};

const InternalLinks = ({ links, title, labelProperty }) => {
	return (
		links.length > 0 && (
			<>
				<dt>{title}</dt>
				{sortArray(labelProperty)(links).map((link) => (
					<dd key={link.id}>
						<Link to={'/concepts/' + link.id}>{link[labelProperty]}</Link>
					</dd>
				))}
			</>
		)
	);
};

const LinksList = ({ links, lang, alone, Dictionnary = D1 }) => {
	const labelProperty = lang === 'lg1' ? 'prefLabelLg1' : 'prefLabelLg2';
	return (
		<Note
			text={
				<dl>
					<InternalLinks
						links={links[NARROWER]}
						title={Dictionnary.narrowerTitle}
						labelProperty={labelProperty}
					/>
					<InternalLinks
						links={links[BROADER]}
						title={Dictionnary.broaderTitle}
						labelProperty={labelProperty}
					/>
					<InternalLinks
						links={links[REFERENCES]}
						title={Dictionnary.referencesTitle}
						labelProperty={labelProperty}
					/>
					<InternalLinks
						links={links[SUCCEED]}
						title={Dictionnary.replacesTitle}
						labelProperty={labelProperty}
					/>
					<InternalLinks
						links={links[RELATED]}
						title={Dictionnary.relatedTitle}
						labelProperty={labelProperty}
					/>
					<InternalLinks
						links={links[IS_REPLACED_BY]}
						title={Dictionnary.replacedByMasc}
						labelProperty={labelProperty}
					/>
					<CloseMatchLinks links={links.closeMatch} Dictionnary={Dictionnary} />
				</dl>
			}
			title={Dictionnary.linksTitle}
			lang={lang}
			alone={alone}
		/>
	);
};

function ConceptLinks({ secondLang, links }) {
	const linksGroupByType = links.reduce(
		(acc, link) => {
			if (!Array.isArray(acc[link.typeOfLink])) {
				return acc;
			}
			return {
				...acc,
				[link.typeOfLink]: [...acc[[link.typeOfLink]], link],
			};
		},
		{
			[NARROWER]: [],
			[BROADER]: [],
			[REFERENCES]: [],
			[SUCCEED]: [],
			[RELATED]: [],
			[CLOSE_MATCH]: [],
			[IS_REPLACED_BY]: [],
		},
	);
	const numberOfLinks = Object.values(linksGroupByType).flat().length;
	if (numberOfLinks === 0) return null;

	return (
		<div className="row concept-links">
			<LinksList links={linksGroupByType} alone={!secondLang} lang="lg1" />
			{secondLang && (
				<LinksList
					links={linksGroupByType}
					alone={false}
					lang="lg2"
					Dictionnary={D2}
				/>
			)}
		</div>
	);
}

export default ConceptLinks;
