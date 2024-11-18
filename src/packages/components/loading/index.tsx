import './loading.scss';
import D from '../i18n';

const getText = (textType?: string) => {
	switch (textType) {
		case 'authentification':
			return D.loading.auth;
		case 'saving':
			return D.loading.saving;
		case 'deleting':
			return D.loading.deleting;
		case 'sending':
			return D.loading.sending;
		case 'exporting':
			return D.loading.exporting;
		case 'validating':
			return D.loading.validating;
		case 'loading':
		default:
			return D.loading.loading;
	}
};

type LoadingTypes = {
	text?: string;
	textType?: string;
};

export const Loading = ({ text, textType }: LoadingTypes) => {
	const style = {
		fill: '#fff',
	};

	const content = text || getText(textType);
	return (
		<div className="loading">
			<div className="loader" style={style}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
					<circle transform="translate(8 0)" cx="0" cy="16" r="0">
						<animate
							attributeName="r"
							values="0; 4; 0; 0"
							dur="1.2s"
							repeatCount="indefinite"
							begin="0"
							keyTimes="0;0.2;0.7;1"
							keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
							calcMode="spline"
						/>
					</circle>
					<circle transform="translate(16 0)" cx="0" cy="16" r="0">
						<animate
							attributeName="r"
							values="0; 4; 0; 0"
							dur="1.2s"
							repeatCount="indefinite"
							begin="0.3"
							keyTimes="0;0.2;0.7;1"
							keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
							calcMode="spline"
						/>
					</circle>
					<circle transform="translate(24 0)" cx="0" cy="16" r="0">
						<animate
							attributeName="r"
							values="0; 4; 0; 0"
							dur="1.2s"
							repeatCount="indefinite"
							begin="0.6"
							keyTimes="0;0.2;0.7;1"
							keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
							calcMode="spline"
						/>
					</circle>
				</svg>
			</div>
			<h3>{content}</h3>
		</div>
	);
};

export const Deleting = () => <Loading textType="deleting" />;
export const Publishing = () => <Loading textType="validating" />;
export const Saving = () => <Loading textType="saving" />;
export const Exporting = () => <Loading textType="exporting" />;
