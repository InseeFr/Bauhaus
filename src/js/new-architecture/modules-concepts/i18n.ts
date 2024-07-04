import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '@inseefr/wilco';
import { Dictionary } from 'js/new-architecture/utils/types';

const dictionary = {
	collectionMembersPanelTitle: {
		fr: (size: number) => `Concepts membres de la collection (${size})`,
		en: (size: number) => `Collection concept members (${size})`,
	},
};

export const D1: Dictionary = createDictionary(firstLang, dictionary);
export const D2: Dictionary = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
