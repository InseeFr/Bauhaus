import { createAllDictionary } from '@utils/dictionnary';

import './index.scss';

const { D } = createAllDictionary({
	welcome: {
		fr: 'Application de gestion des métadonnées de référence',
		en: 'Metadata management application',
	},
});
export const ApplicationTitle = () => {
	return (
		<header className="application-title">
			<div className="application-title__container">
				<div className="application-title__wrapper">
					<h1>
						<img src="/img/logo.svg" alt="application logo" />
						{D.welcome}
					</h1>
				</div>
			</div>
		</header>
	);
};
