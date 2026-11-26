import { useSecondLang } from "@utils/hooks/second-lang";

interface PageTitleBlockTypes {
  titleLg1?: string;
  titleLg2?: string;
}

export const PageTitleBlock = ({ titleLg1, titleLg2 }: Readonly<PageTitleBlockTypes>) => {
  const [secondLang] = useSecondLang();

  return (
    <div className="grid wilco-page-title">
      <div className="col-12 lg:col-10 lg:col-offset-1 wilco-page-title__block">
        <h2 className="wilco-page-title__title ">
          {titleLg1}
          {secondLang && titleLg2 && <div>&quot; {titleLg2} &quot;</div>}
        </h2>
      </div>
    </div>
  );
};
