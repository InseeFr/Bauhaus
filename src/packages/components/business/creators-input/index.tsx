import { ComponentProps } from 'react';
import D, { D2 } from '../../i18n';
import { StampsInput } from '../stamps-input/stamps-input';

export const CreatorsInput = ({
	lang = 'first',
	...props
}: Readonly<ComponentProps<typeof StampsInput>>) => {
	const Dictionnary = lang === 'first' ? D : D2;

	return (
		<StampsInput
			labelSingle={Dictionnary.creatorsInput.creatorTitle}
			labelMulti={Dictionnary.creatorsInput.creatorsTitle}
			lang={lang}
			{...props}
		/>
	);
};
