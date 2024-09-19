import './index.scss';

export const PageSubtitle = ({ subTitle }: Readonly<{ subTitle: string }>) => {
	return (
		<div className="row">
			<div className="col-md-8 text-center col-md-offset-2">
				<h3 className="wilco-page-subtitle">{subTitle}</h3>
			</div>
		</div>
	);
};
