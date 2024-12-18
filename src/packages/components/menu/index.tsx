import { Link } from 'react-router-dom';

import { createAllDictionary } from '@utils/dictionnary';

import './index.scss';

const { D } = createAllDictionary({
	home: {
		fr: 'Accueil',
		en: 'Home',
	},
});

const WITH_SEPARATOR_CLASS = 'with-separator';

interface Path {
	path: string;
	className: string;
	attrs: Record<string, string>;
	image?: string;
	label: string;
}

function getClasses(path: Path, index: number, paths: Path[]) {
	return [
		'nav-item',
		path.className,
		!paths[index + 1] ? '' : WITH_SEPARATOR_CLASS,
	]
		.join(' ')
		.trim();
}

interface MainMenuTypes {
	paths: any[];
}

export const MainMenu = ({ paths }: Readonly<MainMenuTypes>) => {
	const orderedPaths = paths
		.filter((path) => path.shouldBeDisplayed !== false)
		.sort((p1, p2) => p1.order - p2.order);
	const allPaths = [{ label: D.home, path: '/' }, ...orderedPaths].reduce(
		(acc, path) => {
			if (path.alignToRight) {
				return [[...acc[0]], [...acc[1], path]];
			} else {
				return [[...acc[0], path], [...acc[1]]];
			}
		},
		[[], []],
	);

	return (
		<nav className="navbar navbar-default navbar-primary">
			<div className="container-fluid">
				<div
					className="collapse navbar-collapse"
					id="bs-example-navbar-collapse-1"
				>
					<ul className="nav navbar-nav">
						{allPaths[0].map((path: Path, index: number) => {
							const classes = getClasses(path, index, allPaths[0]);

							return (
								<li className={classes} key={path.path}>
									<Link to={path.path} {...path.attrs}>
										{path.label}
									</Link>
								</li>
							);
						})}
					</ul>

					<ul className="nav navbar-nav navbar-right">
						{allPaths[1].map((path: Path, index: number) => {
							const classes = getClasses(path, index, allPaths[1]);

							return (
								<li className={classes} key={path.path}>
									<Link to={path.path} {...path.attrs}>
										{path.label}
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</nav>
	);
};
