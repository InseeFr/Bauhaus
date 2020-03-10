import React from 'react';
import { Note } from '@inseefr/wilco';
import D, { D1, D2 } from 'js/i18n';
import { Link } from 'react-router-dom';

function SeeAlso({ links, langs: { lg1, lg2 }, secondLang }) {
	function displaySeeAlsos(label) {
		function displaySeeAlso(seeAlso, title, path) {
			return (
				seeAlso && (
					<li>
						{title}
						<ul>
							{seeAlso.map(link => (
								<li key={link.id}>
									<Link to={`${path}/${link.id}`}>{link[label]}</Link>
								</li>
							))}
						</ul>
					</li>
				)
			);
		}
		return (
			<ul>
				{displaySeeAlso(
					links.indicator,
					D.indicatorsTitle,
					'/operations/indicator'
				)}
				{displaySeeAlso(
					links.operation,
					D.operationsTitle,
					'/operations/operation'
				)}
				{displaySeeAlso(links.series, D.seriesTitle, '/operations/series')}
				{displaySeeAlso(links.family, D.familiesTitle, '/operations/family')}
			</ul>
		);
	}
	return (
		<div className="row bauhaus-see-also">
			<Note
				text={displaySeeAlsos('labelLg1')}
				title={D1.seeAlso}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={displaySeeAlsos('labelLg2')}
					title={D2.seeAlso}
					lang={lg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</div>
	);
}
export default SeeAlso;
