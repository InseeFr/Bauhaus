interface SimsBlockCodelistCode {
  code: string;
  labelLg1?: string;
  labelLg2?: string;
}

interface SimsBlockCodelistCurrentSection {
  codeList?: string;
  value?: string | string[];
}

interface SimsBlockCodelistTypes {
  codelists: Record<string, { codes: SimsBlockCodelistCode[] }>;
  currentSection: SimsBlockCodelistCurrentSection;
  multi?: boolean;
  isSecondLang: boolean;
}

export const SimsBlockCodelist = ({
  codelists,
  currentSection,
  multi = false,
  isSecondLang,
}: Readonly<SimsBlockCodelistTypes>) => {
  const codes = codelists[currentSection.codeList!].codes;

  if (multi) {
    const value: string[] = Array.isArray(currentSection.value)
      ? currentSection.value
      : [currentSection.value ?? ""];

    // If the list of codes only contain one item, we do not display a list
    const foundCode = codes.find(({ code }) => code === value[0]);

    if (value.length === 1) {
      return isSecondLang ? foundCode?.labelLg2 : foundCode?.labelLg1;
    }

    return (
      <ul>
        {codes
          .filter(({ code }) => value.includes(code))
          .map((code, index) => (
            <li key={index}>{isSecondLang ? code.labelLg2 : code.labelLg1}</li>
          ))}
      </ul>
    );
  }

  const foundCode = codes.find((code) => code.code === currentSection.value);

  return isSecondLang ? foundCode?.labelLg2 : foundCode?.labelLg1;
};
