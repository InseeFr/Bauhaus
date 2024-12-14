import { Link } from 'react-router-dom';

import { Row } from '@components/layout';
import { Note } from '@components/note';

import { D1, D2 } from '../../../deprecated-locales';
import './relations.css';

export type RelationsViewPerLgContentTypes = {
	children: { id: string; labelLg1: string; labelLg2: string }[];
	childrenTitle: string;
	childrenPath: string;
	parent: { id: string; labelLg1: string; labelLg2: string };
	parentTitle: string;
	parentPath: string;
	langSuffix: 'Lg1' | 'Lg2';
};
export const RelationsViewPerLgContent = ({
	children,
	childrenTitle,
	childrenPath,
	parent,
	parentTitle,
	parentPath,
	langSuffix,
}: Readonly<RelationsViewPerLgContentTypes>) => {
	const Dictionnary = langSuffix === 'Lg1' ? D1 : D2;
	return (
		<>
			{parent && (
				<p>
					<span className="links-title">{Dictionnary[parentTitle]}</span>
					<Link to={`/operations/${parentPath}/${parent.id}`}>
						{parent[`label${langSuffix}`]}
					</Link>
				</p>
			)}
			{children && (
				<>
					<p>
						<span className="links-title">{Dictionnary[childrenTitle]}</span>
					</p>
					<ul>
						{children
							.sort(function (a, b) {
								return a[`label${langSuffix}`].localeCompare(
									b[`label${langSuffix}`],
								);
							})
							.map((item) => (
								<li key={item.id}>
									<Link to={`/operations/${childrenPath}/${item.id}`}>
										{item[`label${langSuffix}`]}
									</Link>
								</li>
							))}
					</ul>
				</>
			)}
		</>
	);
};

export function RelationsViewPerLg({
	title,
	secondLang,
	...props
}: RelationsViewPerLgContentTypes &
	Readonly<{
		title: string;
		secondLang: boolean;
	}>) {
	return (
		<Note
			text={<RelationsViewPerLgContent {...props} />}
			title={title}
			alone={!secondLang}
			allowEmpty={true}
		/>
	);
}

function RelationsView(
	props: Readonly<
		{ title: string; secondLang: boolean } & RelationsViewPerLgContentTypes
	>,
) {
	return (
		<Row>
			<RelationsViewPerLg {...props} title={D1[props.title]} langSuffix="Lg1" />
			{props.secondLang && (
				<RelationsViewPerLg
					{...props}
					title={D2[props.title]}
					langSuffix="Lg2"
				/>
			)}
		</Row>
	);
}

export default RelationsView;
