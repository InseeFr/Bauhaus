import './relations.scss';
import { Link } from 'react-router-dom';
import { D1, D2 } from '../../../deprecated-locales';
import { Note } from '../../../components/note';
import { Row } from '../../../components';

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
}

export function RelationsViewPerLg(props) {
	return (
		<Note
			text={<RelationsViewPerLgContent {...props} />}
			title={props.title}
			alone={!props.secondLang}
			allowEmpty={true}
		/>
	);
}

function RelationsView(props) {
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
