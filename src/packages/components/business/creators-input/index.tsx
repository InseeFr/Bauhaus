import { ComponentProps } from 'react';
import D, { D2 } from '../../i18n';
import { OrganisationInput, StampsInput } from '../stamps-input/stamps-input';

export const CreatorsInput = ({
	lang = 'first',
	mode = 'stamp',
	...props
}: Readonly<
	ComponentProps<typeof StampsInput> & { mode: 'stamp' | 'organisation' }
>) => {
	const Dictionary = lang === 'first' ? D : D2;

	if (mode === 'organisation') {
		return (
			<OrganisationInput
				labelSingle={Dictionary.creatorsInput.creatorTitle}
				labelMulti={Dictionary.creatorsInput.creatorsTitle}
				lang={lang}
				{...props}
			/>
		);
	}

	return (
		<StampsInput
			labelSingle={Dictionary.creatorsInput.creatorTitle}
			labelMulti={Dictionary.creatorsInput.creatorsTitle}
			lang={lang}
			{...props}
		/>
	);
};
