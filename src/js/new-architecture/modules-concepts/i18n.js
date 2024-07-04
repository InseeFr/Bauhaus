import {
	createDictionary,
	firstLang,
	getLang,
	secondLang,
} from '@inseefr/wilco';

const dictionary = {
	collectionMembersPanelTitle: {
		fr: (size) => `Concepts membres de la collection (${size})`,
		en: (size) => `Collection concept members (${size})`,
	},
};

export const D1 = createDictionary(firstLang, dictionary);
export const D2 = createDictionary(secondLang, dictionary);

export default getLang() === firstLang ? D1 : D2;
