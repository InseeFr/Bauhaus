import { Link } from 'react-router-dom';
import './index.scss';
import { createAllDictionary } from '../../utils/dictionnary';

const { D } = createAllDictionary({
	home: {
		fr: 'Accueil',
		en: 'Home',
	},
});

const WITH_SEPARATOR_CLASS = 'with-separator';
const defaultHome = { label: D.home, path: '/' };

type Path = {
	path: string;
	className: string;
	attrs: any;
	image?: string;
	label: string;
};

function getClasses(path: Path, index: number, paths: Path[]) {
	return [
		'nav-item',
		path.className,
		!paths[index + 1] ? '' : WITH_SEPARATOR_CLASS,
	]
		.join(' ')
		.trim();
}

type MainMenuTypes = {
	paths: any[];
	home?: any;
};

export const MainMenu = ({
	paths,
	home = defaultHome,
}: Readonly<MainMenuTypes>) => {
	const orderedPaths = paths
		.filter((path) => path.shouldBeDisplayed !== false)
		.sort((p1, p2) => p1.order - p2.order);
	const allPaths = [home, ...orderedPaths].reduce(
		(acc, path) => {
			if (path.alignToRight) {
				return [[...acc[0]], [...acc[1], path]];
			} else {
				return [[...acc[0], path], [...acc[1]]];
			}
		},
		[[], []]
	);

	return (
		<nav className="bauhaus-main-menu navbar navbar-expand navbar-light navbar-primary">
			<div className="container-fluid">
				<div className="collapse navbar-collapse">
					<ul className="navbar-nav my-2 mr-auto">
						{allPaths[0].map((path: Path, index: number) => {
							const classes = getClasses(path, index, allPaths[0]);

							return (
								<li className={classes} key={path.path}>
									<Link to={path.path} {...path.attrs}>
										{path.image ? (
											<img src={path.image} alt={path.label} />
										) : (
											path.label
										)}
									</Link>
								</li>
							);
						})}
					</ul>

					<ul className="navbar-nav navbar-right">
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
