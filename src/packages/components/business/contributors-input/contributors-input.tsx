import { ComponentProps } from 'react';
import D, { D1 } from '../../i18n';
import { StampsInput } from '../stamps-input/stamps-input';

export const ContributorsInput = ({
    lang,
    ...props
}: Readonly<ComponentProps<typeof StampsInput>>) => {
    const Dictionnary = lang === 'first' ? D1 : D;

    return (
        <StampsInput
            labelSingle={Dictionnary.contributors.title}
            labelMulti={Dictionnary.contributors.title}
            lang={lang}
            {...props}
        />
    );
};
