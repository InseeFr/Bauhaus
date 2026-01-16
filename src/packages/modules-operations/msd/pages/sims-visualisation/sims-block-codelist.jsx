const SimsBlockCodeList = ({ codesLists, currentSection, multi = false, isSecondLang }) => {
  const codes = codesLists[currentSection.codeList].codes;

  if (multi) {
    const value = Array.isArray(currentSection.value)
      ? currentSection.value
      : [currentSection.value];

    // If the list of codes only contain one item, we do not display a list
    const foundCode = codes.find(({ code }) => code === value[0]) ?? "";
    if (value.length === 1) {
      return <>{isSecondLang ? foundCode?.labelLg2 : foundCode?.labelLg1}</>;
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
  return <>{isSecondLang ? foundCode?.labelLg2 : foundCode?.labelLg1}</>;
};

export default SimsBlockCodeList;
