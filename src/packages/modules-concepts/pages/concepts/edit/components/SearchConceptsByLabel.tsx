import { useTranslation } from "react-i18next";

import { TextInput } from "@components/form/input";
import { Pagination } from "@components/pagination";

interface SearchConceptsByLabelTypes {
  searchLabel: string;
  hitEls: JSX.Element[];
  handleSearch: (value: string) => void;
}

const SearchConceptsByLabel = ({
  searchLabel,
  handleSearch,
  hitEls,
}: Readonly<SearchConceptsByLabelTypes>) => {
  const { t } = useTranslation();
  return (
    <div>
      <TextInput
        value={searchLabel}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={t("common.searchLabelPlaceholder")}
      />
      <Pagination itemEls={hitEls} />
    </div>
  );
};

export default SearchConceptsByLabel;
