import React from 'react';
import ReactLoading from 'react-loading';
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
	const content = text || getText(textType);
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
