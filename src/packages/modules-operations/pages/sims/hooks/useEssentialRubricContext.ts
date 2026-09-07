import { createContext, useContext } from "react";

import { rangeType } from "../../../constants/rangeType";

const { RICH_TEXT, TEXT, ORGANIZATION, DATE, GEOGRAPHY, CODE_LIST } = rangeType;

const getLabelKey = (secondLang: boolean) => (secondLang ? "labelLg2" : "labelLg1");
const getDocumentsKey = (secondLang: boolean) => (secondLang ? "documentsLg2" : "documentsLg1");

const checkRichText = (richText: any) => {
  if (richText?.getCurrentContent) {
    return !richText.getCurrentContent().hasText();
  }
  return !richText;
};

const hasDocuments = (currentSection: any, secondLang: boolean) =>
  currentSection?.[getDocumentsKey(secondLang)]?.length > 0;

const checkIsEmpty = (msd: any, currentSection: any, secondLang: boolean) => {
  if (!currentSection) {
    return true;
  }

  const labelKey = getLabelKey(secondLang);

  switch (msd.rangeType) {
    case TEXT:
      return !currentSection[labelKey];
    case RICH_TEXT:
      if (hasDocuments(currentSection, secondLang)) {
        return false;
      }
      return checkRichText(currentSection[labelKey]);
    case ORGANIZATION:
    case DATE:
      return !currentSection.value;
    case GEOGRAPHY:
      return !currentSection.uri;
    case CODE_LIST:
      return !currentSection.value || currentSection.value.length === 0;
    default:
      return !currentSection.value;
  }
};

export const isEssentialRubricKo = (msd: any, currentSection: any, secondLang: boolean) => {
  if (!currentSection) {
    return true;
  }

  return checkIsEmpty(msd, currentSection, secondLang);
};

const flatten = (items: any[]): any[] => {
  if (!items || items.length === 0) {
    return items || [];
  }
  return [...items, ...flatten(items.flatMap((item: any) => Object.values(item.children || {})))];
};

export const computeEssentialRubricContext = (metadataStructure: any, rubricsByIdMas: any) => {
  const flat = flatten(Object.values(metadataStructure || {}));
  const rubrics = rubricsByIdMas || {};

  return flat.reduce((acc: any, msd: any) => {
    const msdCopy = { ...msd };
    if (msdCopy.minOccurs === "1") {
      msdCopy.essentialRubricKoLg1 = isEssentialRubricKo(msdCopy, rubrics[msdCopy.idMas], false);
      msdCopy.essentialRubricKoLg2 = isEssentialRubricKo(msdCopy, rubrics[msdCopy.idMas], true);
    }
    acc[msdCopy.idMas] = msdCopy;
    return acc;
  }, {});
};

const EssentialRubricContext = createContext({});

export const EssentialRubricContextProvider = EssentialRubricContext.Provider;

export const useEssentialRubricContext = () => useContext(EssentialRubricContext);
