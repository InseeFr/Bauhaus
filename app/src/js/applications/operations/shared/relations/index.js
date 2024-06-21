import { Note } from '@inseefr/wilco';
import './relations.scss';
import { Link } from 'react-router-dom';
import { D1, D2 } from 'js/i18n';

export function RelationsViewPerLgContent({
	children,
	childrenTitle,
	childrenPath,
	parent,
	parentTitle,
	parentPath,
	langSuffix,
}) {
	const Dictionnary = langSuffix === 'Lg1' ? D1 : D2;
	return (
		<>
			{parent && (
				<p>
					<span className="linksTitle">{Dictionnary[parentTitle]}</span>
					<Link to={`/operations/${parentPath}/${parent.id}`}>
						{parent[`label${langSuffix}`]}
					</Link>
				</p>
			)}
			{children && (
				<>
					<p>
						<span className="linksTitle">{Dictionnary[childrenTitle]}</span>
					</p>
					<ul>
						{children
							.sort(function (a, b) {
								return a[`label${langSuffix}`].localeCompare(
									b[`label${langSuffix}`]
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
}

export function RelationsViewPerLg(props) {
	return (
		<Note
			text={<RelationsViewPerLgContent {...props} />}
			title={props.title}
			lang={props.currentLang}
			alone={!props.secondLang}
			allowEmpty={true}
		/>
	);
}

function RelationsView(props) {
	return (
		<div className="row">
			<RelationsViewPerLg
				{...props}
				title={D1[props.title]}
				langSuffix="Lg1"
				currentLang={props.langs.lg1}
			/>
			{props.secondLang && (
				<RelationsViewPerLg
					{...props}
					title={D2[props.title]}
					langSuffix="Lg2"
					currentLang={props.langs.lg2}
				/>
			)}
		</div>
	);
}

export default RelationsView;
