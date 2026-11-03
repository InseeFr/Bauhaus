import "./page-title.css";

interface PageTitleTypes {
  title: string;
  subtitle?: string;
  col?: number;
  offset?: number;
}

export const PageTitle = ({ title, subtitle, col = 10, offset = 1 }: Readonly<PageTitleTypes>) => {
  return (
    <div className="grid wilco-page-title">
      <div className={`col-12 lg:col-${col} lg:col-offset-${offset} wilco-page-title__block`}>
        <h1 className="wilco-page-title__title ">
          {title}
          {subtitle && <div>&quot; {subtitle} &quot;</div>}
        </h1>
      </div>
    </div>
  );
};
