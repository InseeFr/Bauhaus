import { ComponentProps } from 'react';
import D, { D1 } from '../../i18n';
import { StampsInput } from '../stamps-input/stamps-input';

export const CreatorsInput = ({
	lang,
	...props
}: Readonly<ComponentProps<typeof StampsInput>>) => {
	const Dictionnary = lang === 'first' ? D1 : D;

	return (
		<StampsInput
			labelSingle={Dictionnary.creatorsInput.creatorTitle}
			labelMulti={Dictionnary.creatorsInput.creatorsTitle}
			lang={lang}
			{...props}
		/>
	);
};
