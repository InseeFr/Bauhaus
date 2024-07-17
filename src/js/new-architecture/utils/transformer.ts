import { Options } from '../model/SelectOption';

export const transformModelToSelectOptions = (
	datas: { id: string; label: string }[]
): Options => {
	return datas.map(({ id, label }) => ({ value: id, label }));
};
