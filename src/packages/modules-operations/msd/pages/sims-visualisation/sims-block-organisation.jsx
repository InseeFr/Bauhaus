const SimsBlockOrganisation = ({ organisations, currentSection, isSecondLang }) => {
  const foundOrga = organisations.find((orga) => orga.id === currentSection.value) || {};
  return <span>{isSecondLang ? foundOrga.labelLg2 : foundOrga.label}</span>;
};

export default SimsBlockOrganisation;
