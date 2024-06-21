import ReactLoading from 'react-loading';
import './loading.scss';
import D from '../i18n';

const getText = (textType, D) => {
	switch (textType) {
		case 'authentification':
			return D.loadableAuth;
		case 'saving':
			return D.loadableSaving;
		case 'deleting':
			return D.loadableDeleting;
		case 'sending':
			return D.loadableSending;
		case 'exporting':
			return D.loadableExporting;
		case 'validating':
			return D.loadableValidating;
		case 'loading':
		default:
			return D.loadableLoading;
	}
};

export const Loading = ({ text, textType }) => {
	const content = text || getText(textType, D);
	return (
		<div className="loading">
			<ReactLoading
				className="loader"
				type="spinningBubbles"
				delay={0}
				height="100%"
				width="100%"
			/>
			<h3>{content}</h3>
		</div>
	);
};
export const Deleting = () => <Loading textType="deleting" />;
export const Publishing = () => <Loading textType="validating" />;
