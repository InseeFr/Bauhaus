import { useV2StampsOptions } from '../../../utils/hooks/stamps';
import D, { D1 } from '../../i18n';
import { Select } from '../../ui/select';

export const StampsInput = ({
    value,
    onChange,
    multi = false,
    required = true,
    lang = 'first',
    labelSingle,
    labelMulti
}: Readonly<{
    value: string | string[];
    onChange: (value: string | string[]) => void;
    multi?: boolean;
    required?: boolean;
    lang: 'first' | 'default';
    labelSingle: string
    labelMulti: string
}>) => {
    const stampsOptions = useV2StampsOptions();

    let creatorsArray;
    if (multi) {
        creatorsArray = Array.isArray(value) && value.length > 0 ? value : [];
    } else {
        creatorsArray = value ? value : undefined;
    }

    const Dictionnary = lang === 'first' ? D1 : D;
    const label = !multi
        ? labelSingle
        : labelMulti;

    return (
        <Select
            label={label}
            placeholder={Dictionnary.stampsPlaceholder}
            value={creatorsArray}
            options={stampsOptions}
            onChange={onChange}
            multi={multi}
            required={required}
            filter={true}
            
        />
    );
};
