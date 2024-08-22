import { createAllDictionary } from '../../utils/dictionnary';

const { D } = createAllDictionary({
	see: {
		fr: 'Voir',
		en: 'See',
	},
});

type SeeButtonTypes = {
	onClick: (e: any) => void;
};
export const SeeButton = ({ onClick, ...props }: Readonly<SeeButtonTypes>) => {
	return (
		<button
			{...props}
			type="button"
			className="btn btn-default"
			onClick={onClick}
			aria-label={D.see}
			title={D.see}
		>
			<span className="glyphicon glyphicon-eye-open"></span>
		</button>
	);
};
