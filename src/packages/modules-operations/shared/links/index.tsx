import { Note } from '@inseefr/wilco';
import { Link } from 'react-router-dom';
import { D1, D2 } from '../../../deprecated-locales';

type DisplayLinksTypes = {
	links: any[];
	path: string;
	title: string;
	langs: { lg1: string; lg2: string };
	secondLang?: boolean;
	displayLink?: boolean;
	labelLg1?: string;
	labelLg2?: string;
};
function DisplayLinks({
	links = [],
	path,
	title,
	langs: { lg1, lg2 },
	secondLang,
	displayLink = true,
	labelLg1 = 'labelLg1',
	labelLg2 = 'labelLg2',
}: Readonly<DisplayLinksTypes>) {
	function displayBlock(link: Record<string, string>, label: string) {
		if (displayLink) {
			return <Link to={`${path}${link.id}`}>{link[label]}</Link>;
		}
		return <p>{link[label]}</p>;
	}

	function displayList(label: string) {
		return (
			<ul>
				{links.sort().map((link, index) => (
					<li key={index}>{displayBlock(link, label)}</li>
				))}
			</ul>
		);
	}
	function displayItem(label: string) {
		return displayBlock(links[0], label);
	}
	return (
		<div className="row bauhaus-display-links">
			<Note
				text={
					links.length === 1 ? displayItem(labelLg1) : displayList(labelLg1)
				}
				title={D1[title]}
				lang={lg1}
				alone={!secondLang}
				allowEmpty={true}
			/>
			{secondLang && (
				<Note
					text={
						links.length === 1 ? displayItem(labelLg2) : displayList(labelLg2)
					}
					title={D2[title]}
					lang={lg2}
					alone={false}
					allowEmpty={true}
				/>
			)}
		</div>
	);
}

export default DisplayLinks;