import { CheckSecondLang } from "@components/check-second-lang";
import { PageTitleBlock } from "@components/page-title-block";

const ComponentTitle = ({ component }) => {
  return (
    <>
      <PageTitleBlock titleLg1={component?.labelLg1} titleLg2={component?.labelLg2} />

      <CheckSecondLang />
    </>
  );
};

export default ComponentTitle;
