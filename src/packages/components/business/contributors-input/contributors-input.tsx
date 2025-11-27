import { ComponentProps } from 'react';
import D, { D2 } from '../../i18n';
import { OrganisationInput, StampsInput } from '../stamps-input/stamps-input';

export const ContributorsInput = ({
	lang = 'first',
	mode = 'stamp',
	...props
}: Readonly<
	ComponentProps<typeof StampsInput> & { mode: 'stamp' | 'organisation' }
>) => {
	const Dictionnary = lang === 'first' ? D : D2;

	if (mode === 'organisation') {
		return (
			<OrganisationInput
				labelSingle={Dictionnary.creatorsInput.creatorTitle}
				labelMulti={Dictionnary.creatorsInput.creatorsTitle}
				lang={lang}
				{...props}
			/>
		);
	}

	return (
		<StampsInput
			labelSingle={Dictionnary.contributors.title}
			labelMulti={Dictionnary.contributors.title}
			lang={lang}
			{...props}
		/>
	);
};
