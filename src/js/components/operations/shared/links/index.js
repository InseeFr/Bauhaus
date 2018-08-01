import React from 'react';
import { Note } from 'js/components/shared/note';
import { Link } from 'react-router-dom';

function DisplayLinks({
	links,
	path,
	title,
	langs: { lg1, lg2 },
	secondLang,
	displayLink = true,
}) {
	function displayBlock(link, label) {
		if (displayLink) {
			return <Link to={`${path}${link.id}`}>{link[label]}</Link>;
		}
		return <p>{link[label]}</p>;
	}

	function displayList(label) {
		return <ul>{links.map(link => <li>{displayBlock(link, label)}</li>)}</ul>;
	}
	function displayItem(label) {
		return displayBlock(links[0], label);
	}
	return (
		<div className="row">
			<Note
				text={
					links.length === 1 ? displayItem('labelLg1') : displayList('labelLg1')
				}
				title={title}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={
						links.length === 1
							? displayItem('labelLg2')
							: displayList('labelLg2')
					}
					title={title}
					lang={lg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</div>
	);
}

export default DisplayLinks;
