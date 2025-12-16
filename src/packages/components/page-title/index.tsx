import "./page-title.scss";

interface PageTitleTypes {
  title: string;
  subtitle?: string;
  col?: number;
  offset?: number;
}

export const PageTitle = ({ title, subtitle, col = 10, offset = 1 }: Readonly<PageTitleTypes>) => {
  return (
    <div className="row wilco-page-title">
      <div className={`col-md-${col} wilco-page-title__block col-md-offset-${offset}`}>
        <h1 className="wilco-page-title__title ">
          {title}
          {subtitle && <div>&quot; {subtitle} &quot;</div>}
        </h1>
      </div>
    </div>
  );
};
