import { Rubric } from "../../../../../model/Sims";

interface SimsBlockTextTypes {
  currentSection: Rubric;
  isSecondLang: boolean;
}

export const SimsBlockText = ({
  currentSection,
  isSecondLang,
}: Readonly<SimsBlockTextTypes>) => {
  const content = currentSection[isSecondLang ? "labelLg2" : "labelLg1"];
  return content || "";
};

