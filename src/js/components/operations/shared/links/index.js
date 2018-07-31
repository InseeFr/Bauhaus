import React from 'react';
import { Note } from 'js/components/shared/note';
import './links.css';
import { Link } from 'react-router-dom';

function LinksViewPerLg({
	children,
	childrenTitle,
	childrenPath,
	parent,
	parentTitle,
	parentPath,
	title,
	langs: { lg1, lg2 },
	secondLang,
	currentLang,
}) {
	return (
		<Note
			text={
				<React.Fragment>
					{parent && (
						<p>
							<span className="linksTitle">{parentTitle}:</span>
							<Link to={`/operations/${parentPath}/${parent.id}`}>
								{parent[`label${currentLang}`]}
							</Link>
						</p>
					)}
					{children && (
						<div>
							<p>
								<span className="linksTitle">{childrenTitle}:</span>
							</p>
							<ul>
								{children.map(item => (
									<li>
										<Link to={`/operations/${childrenPath}/${item.id}`}>
											{item[`label${currentLang}`]}
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</React.Fragment>
			}
			title={title}
			lang={lg1}
			alone={!secondLang}
			allowEmpty={true}
		/>
	);
}

function LinksView(props) {
	return (
		<div className="row">
			<LinksViewPerLg {...props} currentLang="Lg1" />
			{props.secondLang && <LinksViewPerLg {...props} currentLang="Lg2" />}
		</div>
	);
}

export default LinksView;
