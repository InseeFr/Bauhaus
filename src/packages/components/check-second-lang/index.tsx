import { useSecondLang } from '@utils/hooks/second-lang';

import { createAllDictionary } from '../../utils/dictionnary';
import './index.scss';

const { D } = createAllDictionary({
	displayLg2: {
		fr: 'Afficher la seconde langue',
		en: 'Display second language',
	},
});
export const CheckSecondLang = () => {
	const [secondLang, toggleSecondLang] = useSecondLang();
	return (
		<div className="row bauhaus-second-lang-checkbox">
			<div className="col-md-10 text-center col-md-offset-1">
				<label>
					<input
						type="checkbox"
						checked={secondLang}
						onChange={() => toggleSecondLang()}
					/>{' '}
					{D.displayLg2}
				</label>
			</div>
		</div>
	);
};
